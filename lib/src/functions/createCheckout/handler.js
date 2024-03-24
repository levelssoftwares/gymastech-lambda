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
        const currentDay = currentDate.toISOString().substr(0, 10);
        const existingCheckin = await client
            .db(dbName)
            .collection("Checkins")
            .findOne({
            alunoId,
            [`${currentMonth}.${currentDay}`]: { $exists: true },
        });
        if (!existingCheckin) {
            await client.close();
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: "Não há check-in válido para fazer check-out.",
                }),
                headers,
            };
        }
        const lastCheckinTime = Object.keys(existingCheckin[currentMonth]).pop();
        await client
            .db(dbName)
            .collection("Checkins")
            .updateOne({ alunoId }, { $set: { [`${currentMonth}.${lastCheckinTime}.saida`]: currentDate.toISOString() } });
        await client.close();
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Check-out realizado com sucesso.",
            }),
            headers,
        };
    }
    catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: error.message || "Falha ao realizar check-out.",
            }),
            headers,
        };
    }
};
//# sourceMappingURL=handler.js.map