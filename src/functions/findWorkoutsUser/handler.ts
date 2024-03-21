import { APIGatewayProxyHandler } from "aws-lambda";
import { MongoClient } from "mongodb";
import { MONGO_URI, headers } from "src/utils/mongoConfig";

export const findWorkoutsUser: APIGatewayProxyHandler = async (event) => {
  const userId = event.queryStringParameters?.userId; // Obtém o ID do usuário dos parâmetros de consulta
  const dbName = event.queryStringParameters?.dbName; // Obtém o nome do banco de dados dos parâmetros de consulta

  try {
    if (!userId || !dbName) {
      throw new Error("ID do usuário e nome do banco de dados são obrigatórios.");
    }

    const client = new MongoClient(MONGO_URI);
    await client.connect();

    const workouts = await client
      .db(dbName)
      .collection("Workouts")
      .find({ alunoId: userId })
      .toArray();
    await client.close();

    return {
      statusCode: 200,
      body: JSON.stringify(workouts),
      headers,
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: error.message || "Falha ao buscar os workouts do usuário.",
      }),
      headers,
    };
  }
};
