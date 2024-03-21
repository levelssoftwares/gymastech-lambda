import { MongoClient } from "mongodb";
import { MONGO_URI, headers } from "src/utils/mongoConfig";
export const findWorkoutsUser = async (event) => {
    var _a, _b;
    const userId = (_a = event.queryStringParameters) === null || _a === void 0 ? void 0 : _a.userId;
    const dbName = (_b = event.queryStringParameters) === null || _b === void 0 ? void 0 : _b.dbName;
    try {
        if (!userId || !dbName) {
            throw new Error("ID do usuário e nome do banco de dados são obrigatórios.");
        }
        const client = new MongoClient(MONGO_URI);
        await client.connect();
        const workouts = await client
            .db(dbName)
            .collection("Workout")
            .find({ alunoId: userId })
            .toArray();
        await client.close();
        return {
            statusCode: 200,
            body: JSON.stringify(workouts),
            headers,
        };
    }
    catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: error.message || "Falha ao buscar os workouts do usuário.",
            }),
            headers,
        };
    }
};
//# sourceMappingURL=handler.js.map