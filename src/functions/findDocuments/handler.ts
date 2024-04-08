import { APIGatewayProxyHandler } from "aws-lambda";
import { MongoClient } from "mongodb";
import { MONGO_URI, headers } from "src/utils/mongoConfig";

export const findDocuments: APIGatewayProxyHandler = async (event) => {
  const dbName = event.queryStringParameters?.dbName;
  console.log('dbName', dbName)
  try {
    const client = new MongoClient(MONGO_URI);
    await client.connect();

    const events = await client
      .db(dbName)
      .collection("Documents")
      .find({})
      .toArray();

    await client.close();

    return {
      statusCode: 200,
      body: JSON.stringify(events),
      headers,
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: error.message || "Falha ao buscar eventos.",
      }),
      headers,
    };
  }
};
