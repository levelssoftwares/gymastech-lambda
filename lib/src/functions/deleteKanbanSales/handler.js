import { MongoClient } from "mongodb";
import { MONGO_URI, headers } from "src/utils/mongoConfig";
export const deleteKanbanSales = async (event) => {
    var _a, _b;
    try {
        const dbName = (_a = event.queryStringParameters) === null || _a === void 0 ? void 0 : _a.dbName;
        const _id = (_b = event.queryStringParameters) === null || _b === void 0 ? void 0 : _b._id;
        if (!_id || !_id.trim()) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: "Parâmetro _id não fornecido.",
                }),
                headers,
            };
        }
        const client = new MongoClient(MONGO_URI);
        await client.connect();
        const response = await client
            .db(dbName)
            .collection("Sales")
            .deleteOne({ _id: _id });
        await client.close();
        if (response.deletedCount === 1) {
            return {
                statusCode: 200,
                body: JSON.stringify({
                    message: "Tarefa deletada com sucesso.",
                }),
                headers,
            };
        }
        else {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    message: "Tarefa não encontrada.",
                }),
                headers,
            };
        }
    }
    catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: error.message || "Falha ao deletar tarefa.",
            }),
            headers,
        };
    }
};
//# sourceMappingURL=handler.js.map