import { MongoClient } from "mongodb";
import { MONGO_URI, headers } from "src/utils/mongoConfig";
export const findUsersByDatabaseAndRole = async (event) => {
    var _a, _b;
    const databaseName = (_a = event.queryStringParameters) === null || _a === void 0 ? void 0 : _a.databaseName;
    const role = (_b = event.queryStringParameters) === null || _b === void 0 ? void 0 : _b.role;
    if (!databaseName) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: "O nome do banco de dados é obrigatório.",
            }),
            headers,
        };
    }
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    try {
        const db = client.db(databaseName);
        const usersCollection = db.collection("Users");
        let query = {};
        if (role) {
            query = { role };
        }
        const users = await usersCollection.find(query).toArray();
        await client.close();
        if (users.length > 0) {
            return {
                statusCode: 200,
                body: JSON.stringify(users),
                headers,
            };
        }
        else {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    message: "Nenhum usuário encontrado.",
                }),
                headers,
            };
        }
    }
    catch (error) {
        console.error('ERROR:', error.response.status, 'Message:', error.response.data.message);
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