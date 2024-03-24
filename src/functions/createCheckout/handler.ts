import { APIGatewayProxyHandler } from "aws-lambda";
import { MongoClient } from "mongodb";
import { MONGO_URI, headers } from "src/utils/mongoConfig";

export const updateCheckouts: APIGatewayProxyHandler = async (event) => {
  const { dbName, alunoId } = event.queryStringParameters || {};

  if (!dbName || !alunoId) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Parâmetros 'dbName' e 'alunoId' são obrigatórios.",
      }),
      headers,
    };
  }

  try {
    const client = new MongoClient(MONGO_URI);
    await client.connect();

    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString("default", {
      month: "long",
    });
    
    // Ajustar o fuso horário para o Brasil (BRT)
    currentDate.setUTCHours(currentDate.getUTCHours() - 3);
    const currentDayHour = currentDate.toISOString().slice(0, 19);

    // Obter o último objeto do mês corrente para o aluno
    const lastCheckin = await client
      .db(dbName)
      .collection("Checkins")
      .findOne({ alunoId }, { [currentMonth]: { $exists: true, $ne: {} } });

    if (!lastCheckin || !lastCheckin[currentMonth]) {
      // Se não houver registro de check-in para o aluno no mês corrente, retornar erro
      await client.close();
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Não há registro de check-in para o aluno neste mês.",
        }),
        headers,
      };
    }

    const lastCheckinDate = Object.keys(lastCheckin[currentMonth]).pop(); // Obter a última entrada


    // Atualizar o campo 'saida' do último check-in
    await client
      .db(dbName)
      .collection("Checkins")
      .updateOne(
        { alunoId, [`${currentMonth}.${lastCheckinDate}.saida`]: null },
        { $set: { [`${currentMonth}.${lastCheckinDate}.saida`]: currentDayHour } }
      );

    await client.close();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Saída atualizada com sucesso.",
      }),
      headers,
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: error.message || "Falha ao atualizar a saída.",
      }),
      headers,
    };
  }
};
