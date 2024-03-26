import { MongoClient } from "mongodb";
import { MONGO_URI, headers } from "src/utils/mongoConfig";
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
        const currentDate = new Date();
        const currentMonth = currentDate.toLocaleString("default", {
            month: "long",
        });
        currentDate.setUTCHours(currentDate.getUTCHours() - 3);
        const currentDayHour = currentDate.toISOString().slice(0, 19);
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
        await client
            .db(dbName)
            .collection("Checkins")
            .updateOne({ alunoId, [`${currentMonth}.${lastCheckinDate}.saida`]: null }, { $set: { [`${currentMonth}.${lastCheckinDate}.saida`]: currentDayHour } });
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