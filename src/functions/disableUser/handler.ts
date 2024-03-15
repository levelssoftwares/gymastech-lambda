import "abort-controller/polyfill";
import { APIGatewayProxyHandler } from "aws-lambda";
import { MongoClient } from "mongodb";
import { MONGO_URI, headers } from "src/utils/mongoConfig";

export const toggleUserStatus: APIGatewayProxyHandler = async (event) => {
  const userId = event.queryStringParameters?.userId;
  const requesterId = event.queryStringParameters?.requesterId;
  const requesterRole = event.queryStringParameters?.requesterRole;

  if (!userId || !requesterId || !requesterRole) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message:
          "ID do usuário, ID do solicitante e a função do solicitante são obrigatórios.",
      }),
      headers,
    };
  }

  const client = new MongoClient(MONGO_URI);
  await client.connect();

  try {
    const adminDb = client.db("admin").admin();
    const dbList = await adminDb.listDatabases();
    const databases = dbList.databases.map((db) => db.name);

    for (const dbName of databases) {
      const db = client.db(dbName);
      const usersCollection = db.collection("Users");

      const existingUser = await usersCollection.findOne({
        _id: userId as any,
      });

      if (!existingUser) {
        await client.close();
        return {
          statusCode: 404,
          body: JSON.stringify({
            message: "Usuário não encontrado em nenhum banco de dados.",
          }),
          headers,
        };
      }

      if (requesterRole !== "admin" && requesterRole !== "customer") {
        await client.close();
        return {
          statusCode: 403,
          body: JSON.stringify({
            message: "Você não tem permissão para alterar o status do usuário.",
          }),
          headers,
        };
      }

      const isActive = existingUser.isActive;
      const newStatus = !isActive;

      await usersCollection.updateOne(
        { _id: userId as any },
        { $set: { isActive: newStatus } }
      );

      await client.close();

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: `Usuário ${newStatus ? "ativado" : "desativado"} com sucesso.`,
        }),
        headers,
      };
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
    console.error("Erro ao alterar status do usuário:", error);
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
