import "abort-controller/polyfill";
import { MongoClient, ObjectId } from "mongodb";
import { MONGO_URI, headers } from "src/utils/mongoConfig";
export const findDbUsers = async (event) => {
    var _a;
    const userId = (_a = event.queryStringParameters) === null || _a === void 0 ? void 0 : _a.userId;
    if (!userId) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: "O ID do usuário é obrigatório.",
            }),
            headers,
        };
    }
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    const databases = ["TTP-GYM", "NOME_DA_COMPANHIA"];
    try {
        for (const dbName of databases) {
            const db = client.db(dbName);
            const usersCollection = db.collection("users");
            const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
            if (user) {
                await client.close();
                return {
                    statusCode: 200,
                    body: JSON.stringify(user),
                    headers,
                };
            }
        }
        await client.close();
        return {
            statusCode: 404,
            body: JSON.stringify({
                message: "Usuário não encontrado em nenhum banco de dados.",
            }),
            headers,
        };
    }
    catch (error) {
        console.error("Erro ao buscar usuário:", error);
        await client.close();
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Erro interno do servidor.",
            }),
            headers,
        };
    }
};
//# sourceMappingURL=handler.js.map