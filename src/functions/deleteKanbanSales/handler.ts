import { APIGatewayProxyHandler } from "aws-lambda";
import { MongoClient } from "mongodb";
import { MONGO_URI, headers } from "src/utils/mongoConfig";

export const deleteKanbanSales: APIGatewayProxyHandler = async (event) => {
  try {
    const dbName = event.queryStringParameters?.dbName;
    const _id = event.queryStringParameters?._id;

    if (!_id || !_id.trim()) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Parâmetro _id não fornecido.",
        }),
        headers,
      };
    }

    const client = new MongoClient(MONGO_URI);
    await client.connect();

    const response = await client
      .db(dbName)
      .collection("Sales")
      .deleteOne({ _id: _id as any });

    await client.close();

    if (response.deletedCount === 1) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "Tarefa deletada com sucesso.",
        }),
        headers,
      };
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: "Tarefa não encontrada.",
        }),
        headers,
      };
    }
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: error.message || "Falha ao deletar tarefa.",
      }),
      headers,
    };
  }
};
