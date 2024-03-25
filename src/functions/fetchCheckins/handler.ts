import { APIGatewayProxyHandler } from "aws-lambda";
import { MongoClient } from "mongodb";
import { MONGO_URI, headers } from "src/utils/mongoConfig";

export const fetchAllCheckinsHandler: APIGatewayProxyHandler = async (
  event
) => {
  const { dbName, alunoId } = event.queryStringParameters || {};

  if (!dbName) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "O parâmetro 'dbName' é obrigatório.",
      }),
      headers,
    };
  }

  try {
    const client = new MongoClient(MONGO_URI);
    await client.connect();

    let query = {};
    if (alunoId) {
      query = { alunoId };
    }

    const checkins = await client
      .db(dbName)
      .collection("Checkins")
      .find(query)
      .toArray();

    await client.close();
    
    return {
      statusCode: 200,
      body: JSON.stringify(checkins),
      headers,
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: error.message || "Falha ao buscar check-ins.",
      }),
      headers,
    };
  }
};
