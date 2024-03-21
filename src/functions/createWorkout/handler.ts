import { APIGatewayProxyHandler } from "aws-lambda";
import { MongoClient } from "mongodb";
import { MONGO_URI, headers } from "src/utils/mongoConfig";

export const createWorkout: APIGatewayProxyHandler = async (event) => {
  const workoutEventData = JSON.parse(event.body);
  const dbName = event.queryStringParameters?.dbName;
  const userId = workoutEventData.userId;
  const date = workoutEventData.date;
  const alunoId = workoutEventData.alunoId;

  if (!alunoId || !dbName) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Aluno ID ou nome do banco de dados não fornecido.",
      }),
      headers,
    };
  }

  try {
    const client = new MongoClient(MONGO_URI);
    await client.connect();

    const existingWorkout = await client
      .db(dbName)
      .collection("Workouts")
      .findOne({ userId: userId, date: date });

    if (existingWorkout) {
      await client.close();
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Já existe um treino para este usuário nesta data.",
        }),
        headers,
      };
    }

    await client.db(dbName).collection("Workouts").insertOne(workoutEventData);

    await client.close();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Evento de treino salvo com sucesso.",
        insertedWorkoutEvent: workoutEventData,
      }),
      headers,
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: error.message || "Falha ao inserir evento de treino.",
      }),
      headers,
    };
  }
};
