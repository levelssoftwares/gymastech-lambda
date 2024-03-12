import { APIGatewayProxyHandler } from "aws-lambda";
import { MongoClient } from "mongodb";
import { MONGO_URI, headers } from "src/utils/mongoConfig";

export const findUsersByDatabaseAndRole: APIGatewayProxyHandler = async (
  event
) => {
  const databaseName = event.queryStringParameters?.databaseName;
  const role = event.queryStringParameters?.role;

  if (!databaseName) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "O nome do banco de dados é obrigatório.",
      }),
      headers,
    };
  }

  const client = new MongoClient(MONGO_URI);
  await client.connect();

  try {
    const db = client.db(databaseName);
    const usersCollection = db.collection("Users");

    let query = {};
    if (role) {
      query = { role };
    }

    const users = await usersCollection.find(query).toArray();

    await client.close();

    if (users.length > 0) {
      return {
        statusCode: 200,
        body: JSON.stringify(users),
        headers,
      };
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: "Nenhum usuário encontrado.",
        }),
        headers,
      };
    }
  } catch (error) {
    console.error('ERROR:', error.response.status, 'Message:', error.response.data.message);
    await client.close();

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Erro interno do servidor.",
      }),
      headers,
    };
  }
};
