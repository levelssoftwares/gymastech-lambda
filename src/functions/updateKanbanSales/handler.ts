import { APIGatewayProxyHandler } from "aws-lambda";
import { MongoClient } from "mongodb";
import { MONGO_URI, headers } from "src/utils/mongoConfig";

interface UpdateTaskData {
  _id: string;
  columnId: string;
  name: string;
  phoneNumber: string;
  content: string;
  date: string;
  tag: string[];
}

export const updateKanbanSales: APIGatewayProxyHandler = async (event) => {
  try {
    const data = JSON.parse(event.body);
    const dbName = event.queryStringParameters?.dbName;

    const { _id, columnId, name, phoneNumber, content, tag } = data;

    const updatedTaskData: UpdateTaskData = {
      _id,
      columnId,
      name,
      phoneNumber,
      content,
      date: new Date().toISOString(),
      tag,
    };

    const client = new MongoClient(MONGO_URI);
    await client.connect();

    const response = await client.db(dbName).collection("Sales").updateOne(
      { _id: _id },
      { $set: updatedTaskData }
    );

    await client.close();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Tarefa atualizada com sucesso.",
        updatedTask: response,
      }),
      headers,
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: error.message || "Falha ao atualizar tarefa.",
      }),
      headers,
    };
  }
};
