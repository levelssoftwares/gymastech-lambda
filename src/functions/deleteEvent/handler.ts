import { APIGatewayProxyHandler } from "aws-lambda";
import { MongoClient } from "mongodb";
import { MONGO_URI, headers } from "src/utils/mongoConfig";

export const deleteEvent: APIGatewayProxyHandler = async (event) => {
  const eventId = event.queryStringParameters?.eventId;
  const dbName = event.queryStringParameters?.dbName;

  try {
    const client = new MongoClient(MONGO_URI);
    await client.connect();

    const response = await client
      .db(dbName)
      .collection("Events")
      .deleteOne({ _id: eventId as any });
    
    await client.close();

    if (response.deletedCount === 1) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "Evento deletado com sucesso.",
        }),
        headers,
      };
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: "Evento não encontrado.",
        }),
        headers,
      };
    }
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: error.message || "Falha ao deletar evento.",
      }),
      headers,
    };
  }
};
