import "abort-controller/polyfill";
import { APIGatewayProxyHandler } from "aws-lambda";
import { MongoClient } from "mongodb";
import { MONGO_URI, headers } from "src/utils/mongoConfig";

export const findDbUsers: APIGatewayProxyHandler = async (event) => {
  const userId = event.queryStringParameters?.userId;

  if (!userId) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "O ID do usuário é obrigatório.",
      }),
      headers,
    };
  }

  const client = new MongoClient(MONGO_URI);
  await client.connect();

  // Lista de bancos de dados para iterar. O Ideal é escrever uma função para trazer diretamente do Mongo o nome dos Bancos de Dados
  const databases = ["TTP-GYM", "NOME_DA_COMPANHIA"]; // pode adiciona mais banco, desde que estjam criados.
  try {
    for (const dbName of databases) {
      const db = client.db(dbName);
      const usersCollection = db.collection("Users");
      const user = await usersCollection.findOne({ _id: userId as any });

      if (user) {
        await client.close();

        const response = {
          user,
          databaseName: dbName,
        };

        return {
          statusCode: 200,
          body: JSON.stringify(response),
          headers,
        };
      }
    }

    await client.close();

    return {
      statusCode: 404,
      body: JSON.stringify({
        message: "Usuário não encontrado em nenhum banco de dados.",
      }),
      headers,
    };
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
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
