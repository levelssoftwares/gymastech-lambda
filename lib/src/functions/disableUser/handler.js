import "abort-controller/polyfill";
import { MongoClient } from "mongodb";
import { MONGO_URI, headers } from "src/utils/mongoConfig";
export const toggleUserStatus = async (event) => {
    var _a, _b, _c, _d, _e;
    const userId = (_a = event.queryStringParameters) === null || _a === void 0 ? void 0 : _a.userId;
    const requesterId = (_c = (_b = event.requestContext) === null || _b === void 0 ? void 0 : _b.authorizer) === null || _c === void 0 ? void 0 : _c.userId;
    const requesterRole = (_e = (_d = event.requestContext) === null || _d === void 0 ? void 0 : _d.authorizer) === null || _e === void 0 ? void 0 : _e.role;
    if (!userId || !requesterId || !requesterRole) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: "ID do usuário, ID do solicitante e a função do solicitante são obrigatórios.",
            }),
            headers,
        };
    }
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    try {
        const adminDb = client.db("admin").admin();
        const dbList = await adminDb.listDatabases();
        const databases = dbList.databases.map((db) => db.name);
        for (const dbName of databases) {
            const db = client.db(dbName);
            const usersCollection = db.collection("Users");
            const existingUser = await usersCollection.findOne({ _id: userId });
            if (!existingUser) {
                await client.close();
                return {
                    statusCode: 404,
                    body: JSON.stringify({
                        message: "Usuário não encontrado em nenhum banco de dados.",
                    }),
                    headers,
                };
            }
            if (requesterRole !== "admin" && requesterRole !== "customer") {
                await client.close();
                return {
                    statusCode: 403,
                    body: JSON.stringify({
                        message: "Você não tem permissão para alterar o status do usuário.",
                    }),
                    headers,
                };
            }
            const isActive = existingUser.isActive;
            const newStatus = !isActive;
            await usersCollection.updateOne({ _id: userId }, { $set: { isActive: newStatus } });
            await client.close();
            return {
                statusCode: 200,
                body: JSON.stringify({
                    message: `Usuário ${newStatus ? 'ativado' : 'desativado'} com sucesso.`,
                }),
                headers,
            };
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
        console.error("Erro ao alterar status do usuário:", error);
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