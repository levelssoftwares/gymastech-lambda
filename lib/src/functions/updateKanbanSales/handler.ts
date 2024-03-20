import { MongoClient } from "mongodb";
import { MONGO_URI, headers } from "src/utils/mongoConfig";
export const updateKanbanSales = async (event) => {
    var _a;
    try {
        const data = JSON.parse(event.body);
        const dbName = (_a = event.queryStringParameters) === null || _a === void 0 ? void 0 : _a.dbName;
        const { _id, columnId, name, phoneNumber, content, tag } = data;
        const updatedTaskData = {
            _id,
            columnId,
            name,
            phoneNumber,
            content,
            date: new Date().toISOString(),
            tag,
        };
        const client = new MongoClient(MONGO_URI);
        await client.connect();
        const response = await client.db(dbName).collection("Sales").updateOne({ _id: _id }, { $set: updatedTaskData });
        await client.close();
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Tarefa atualizada com sucesso.",
                updatedTask: response,
            }),
            headers,
        };
    }
    catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: error.message || "Falha ao atualizar tarefa.",
            }),
            headers,
        };
    }
};
//# sourceMappingURL=handler.js.map