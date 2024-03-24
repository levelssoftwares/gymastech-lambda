import { APIGatewayProxyHandler } from "aws-lambda";
import { MongoClient } from "mongodb";
import { MONGO_URI, headers } from "src/utils/mongoConfig";

interface CheckinRegistro {
  entrada: string;
  saida: string | null;
}

export const createCheckins: APIGatewayProxyHandler = async (event) => {
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

    // Obter o último registro de check-in do aluno
    const lastCheckin = await client
      .db(dbName)
      .collection("Checkins")
      .findOne({ alunoId }, { sort: { $natural: -1 } });

    if (lastCheckin && lastCheckin[currentMonth]) {
      const lastEntryKey = Object.keys(lastCheckin[currentMonth]).pop(); // Obtém a chave do último registro

      if (lastCheckin[currentMonth][lastEntryKey].saida === null) {
        // Se o último check-in do aluno tiver uma saída nula, retornar erro
        await client.close();
        return {
          statusCode: 400,
          body: JSON.stringify({
            message: "Você já tem um check-in ativo, faça o checkout.",
          }),
          headers,
        };
      }
    }

    // Inserir novo registro de check-in para o aluno com a data e hora atuais
    const newCheckin: CheckinRegistro = {
      entrada: currentDayHour,
      saida: null,
    };

    // Atualizar o registro de check-in para o aluno na data e hora vigentes
    await client
      .db(dbName)
      .collection("Checkins")
      .updateOne(
        { alunoId },
        {
          $set: {
            [`${currentMonth}.${currentDayHour}`]: newCheckin,
          },
        },
        { upsert: true } // Criar o documento se ele não existir
      );

    await client.close();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Check-in salvo com sucesso.",
      }),
      headers,
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: error.message || "Falha ao inserir check-in.",
      }),
      headers,
    };
  }
};
