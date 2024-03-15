import { MongoClient } from "mongodb";
import { MONGO_URI, headers } from "src/utils/mongoConfig";
export const createEvent = async (event) => {
    var _a;
    const eventData = JSON.parse(event.body);
    const dbName = (_a = event.queryStringParameters) === null || _a === void 0 ? void 0 : _a.dbName;
    const { _id, start, end, title, color } = eventData;
    try {
        const client = new MongoClient(MONGO_URI);
        await client.connect();
        const response = await client
            .db(dbName)
            .collection("Events")
            .insertOne({ _id, start, end, title, color });
        await client.close();
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Evento salvo com sucesso.",
                insertedEvent: response,
            }),
            headers,
        };
    }
    catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: error.message || "Falha ao inserir evento.",
            }),
            headers,
        };
    }
};
//# sourceMappingURL=handler.js.map