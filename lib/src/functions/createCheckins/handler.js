import { MongoClient } from "mongodb";
import { MONGO_URI, headers } from "src/utils/mongoConfig";
export const createCheckins = async (event) => {
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
        const currentDayHour = currentDate.toISOString().slice(0, 19);
        const existingCheckin = await client
            .db(dbName)
            .collection("Checkins")
            .findOne({
            alunoId,
            [`${currentMonth}.${currentDayHour}.saida`]: null,
        });
        if (existingCheckin) {
            await client.close();
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: "Você já fez o check-in hoje e ainda não fez check-out.",
                }),
                headers,
            };
        }
        const newCheckin = {
            entrada: currentDayHour,
            saida: null,
        };
        await client
            .db(dbName)
            .collection("Checkins")
            .updateOne({ alunoId }, {
            $set: {
                [`${currentMonth}.${currentDayHour}`]: newCheckin,
            },
        }, { upsert: true });
        await client.close();
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Check-in salvo com sucesso.",
            }),
            headers,
        };
    }
    catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: error.message || "Falha ao inserir check-in.",
            }),
            headers,
        };
    }
};
//# sourceMappingURL=handler.js.map