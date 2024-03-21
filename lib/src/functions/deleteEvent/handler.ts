import { MongoClient } from "mongodb";
import { MONGO_URI, headers } from "src/utils/mongoConfig";
export const deleteEvent = async (event) => {
    var _a, _b;
    const eventId = (_a = event.queryStringParameters) === null || _a === void 0 ? void 0 : _a.eventId;
    const dbName = (_b = event.queryStringParameters) === null || _b === void 0 ? void 0 : _b.dbName;
    try {
        const client = new MongoClient(MONGO_URI);
        await client.connect();
        const response = await client
            .db(dbName)
            .collection("Events")
            .deleteOne({ _id: eventId });
        await client.close();
        if (response.deletedCount === 1) {
            return {
                statusCode: 200,
                body: JSON.stringify({
                    message: "Evento deletado com sucesso.",
                }),
                headers,
            };
        }
        else {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    message: "Evento não encontrado.",
                }),
                headers,
            };
        }
    }
    catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: error.message || "Falha ao deletar evento.",
            }),
            headers,
        };
    }
};
//# sourceMappingURL=handler.js.map