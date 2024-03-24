import { MongoClient } from "mongodb";
import { MONGO_URI, headers } from "src/utils/mongoConfig";
import { DateTime } from "luxon";
export const updateCheckouts = async (event) => {
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
        const brazilDateTime = DateTime.now().setZone('America/Sao_Paulo');
        const currentMonth = brazilDateTime.toLocaleString({ month: "long" });
        const lastCheckin = await client
            .db(dbName)
            .collection("Checkins")
            .findOne({ alunoId }, { [currentMonth]: { $exists: true, $ne: {} } });
        if (!lastCheckin || !lastCheckin[currentMonth]) {
            await client.close();
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: "Não há registro de check-in para o aluno neste mês.",
                }),
                headers,
            };
        }
        const lastCheckinDate = Object.keys(lastCheckin[currentMonth]).pop();
        const currentDateISO = brazilDateTime.toISO();
        await client
            .db(dbName)
            .collection("Checkins")
            .updateOne({ alunoId, [`${currentMonth}.${lastCheckinDate}.saida`]: null }, { $set: { [`${currentMonth}.${lastCheckinDate}.saida`]: currentDateISO } });
        await client.close();
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Saída atualizada com sucesso.",
            }),
            headers,
        };
    }
    catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: error.message || "Falha ao atualizar a saída.",
            }),
            headers,
        };
    }
};
//# sourceMappingURL=handler.js.map