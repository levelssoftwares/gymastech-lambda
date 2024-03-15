import { APIGatewayProxyHandler } from "aws-lambda";
import { MongoClient } from "mongodb";
import { MONGO_URI, headers } from "src/utils/mongoConfig";

export const createEvent: APIGatewayProxyHandler = async (event) => {
  const eventData = JSON.parse(event.body);
  const dbName = event.queryStringParameters?.dbName;

  const { start, end, title, color } = eventData;
  try {
    const client = new MongoClient(MONGO_URI);
    await client.connect();

    const response = await client
      .db(dbName)
      .collection("Events")
      .insertOne({ start, end, title, color });

    await client.close();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Evento salvo com sucesso.",
        insertedEvent: response
      }),
      headers,
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: error.message || "Falha ao inserir evento.",
      }),
      headers,
    };
  }
};
