import { MongoClient } from "mongodb";
import { MONGO_URI, headers } from "src/utils/mongoConfig";
export const fetchKanbanSales = async (event) => {
    var _a;
    try {
        const dbName = (_a = event.queryStringParameters) === null || _a === void 0 ? void 0 : _a.dbName;
        const client = new MongoClient(MONGO_URI);
        await client.connect();
        const tasks = await client
            .db(dbName)
            .collection("Sales")
            .find({})
            .toArray();
        await client.close();
        console.log('JSON.stringify(tasks),', JSON.stringify(tasks));
        return {
            statusCode: 200,
            body: JSON.stringify(tasks),
            headers,
        };
    }
    catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: error.message || "Falha ao buscar tarefas.",
            }),
            headers,
        };
    }
};
//# sourceMappingURL=handler.js.map