import { MongoClient } from "mongodb";
import { MONGO_URI, headers } from "src/utils/mongoConfig";
export const createKanbanSales = async (event) => {
    var _a;
    try {
        const data = JSON.parse(event.body);
        const dbName = (_a = event.queryStringParameters) === null || _a === void 0 ? void 0 : _a.dbName;
        const { _id, columnId, name, phoneNumber, content, tag } = data;
        const newTask = {
            _id,
            columnId,
            name,
            phoneNumber,
            content,
            date: new Date().toISOString(),
            tag,
        };
        console.log('newTask', newTask);
        const client = new MongoClient(MONGO_URI);
        await client.connect();
        const response = await client
            .db(dbName)
            .collection("Sales")
            .insertOne(newTask);
        await client.close();
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Tarefa salva com sucesso.",
                insertedTask: response,
            }),
            headers,
        };
    }
    catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: error.message || "Falha ao inserir tarefa.",
            }),
            headers,
        };
    }
};
//# sourceMappingURL=handler.js.map