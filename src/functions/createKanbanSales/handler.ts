import { APIGatewayProxyHandler } from "aws-lambda";
import { MongoClient } from "mongodb";
import { MONGO_URI, headers } from "src/utils/mongoConfig";

interface Task {
  _id: string;
  columnId: string;
  name: string;
  phoneNumber: string;
  content: string;
  date: string;
  tag: string[];
}

export const createKanbanSales: APIGatewayProxyHandler = async (event) => {
  try {
    const data = JSON.parse(event.body);
    const dbName = event.queryStringParameters?.dbName;

    const { _id, columnId, name, phoneNumber, content, tag } = data;

    const newTask: Task = {
      _id,
      columnId,
      name,
      phoneNumber,
      content,
      date: new Date().toISOString(),
      tag,
    };
    console.log('newTask', newTask)
    const client = new MongoClient(MONGO_URI);
    await client.connect();

    const response = await client
      .db(dbName)
      .collection("Sales")
      .insertOne(newTask as any);

    await client.close();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Tarefa salva com sucesso.",
        insertedTask: response,
      }),
      headers,
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: error.message || "Falha ao inserir tarefa.",
      }),
      headers,
    };
  }
};
