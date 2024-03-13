import { MongoClient } from "mongodb";
import { MONGO_URI, headers } from "src/utils/mongoConfig";
export const findUsersByDatabaseAndRole = async (event) => {
    var _a, _b, _c, _d, _e;
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
        if (users.length > 0) {
            return {
                statusCode: 200,
                body: JSON.stringify(users),
                headers,
            };
        }
        else {
            let message = "Nenhum usuário encontrado.";
            if (role === "personal") {
                message = "Nenhum personal encontrado.";
            }
            else if (role === "alunos") {
                message = "Nenhum aluno encontrado.";
            }
            return {
                statusCode: 404,
                body: JSON.stringify({
                    message,
                }),
                headers,
            };
        }
    }
    catch (error) {
        console.error("ERROR:", (_c = error.response) === null || _c === void 0 ? void 0 : _c.status, "Message:", (_e = (_d = error.response) === null || _d === void 0 ? void 0 : _d.data) === null || _e === void 0 ? void 0 : _e.message);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Erro interno do servidor.",
            }),
            headers,
        };
    }
    finally {
        await client.close();
    }
};
//# sourceMappingURL=handler.js.map