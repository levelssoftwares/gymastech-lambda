import { APIGatewayProxyHandler } from "aws-lambda";
import { MongoClient } from "mongodb";
import { MONGO_URI, headers } from "src/utils/mongoConfig";

export const createWorkout: APIGatewayProxyHandler = async (event) => {
  const workoutEventData = JSON.parse(event.body);
  const dbName = event.queryStringParameters?.dbName;

  try {
    const client = new MongoClient(MONGO_URI);
    await client.connect();

     await client
      .db(dbName)
      .collection("Workouts")
      .insertOne(workoutEventData);

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
