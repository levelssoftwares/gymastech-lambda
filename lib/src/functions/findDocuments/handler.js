import { MongoClient } from "mongodb";
import { MONGO_URI, headers } from "src/utils/mongoConfig";
export const findDocuments = async (event) => {
    var _a;
    const dbName = (_a = event.queryStringParameters) === null || _a === void 0 ? void 0 : _a.dbName;
    console.log('dbName', dbName);
    try {
        const client = new MongoClient(MONGO_URI);
        await client.connect();
        const events = await client
            .db(dbName)
            .collection("Documents")
            .find({})
            .toArray();
        await client.close();
        console.log('AAAAA', events);
        return {
            statusCode: 200,
            body: JSON.stringify(events),
            headers,
        };
    }
    catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: error.message || "Falha ao buscar eventos.",
            }),
            headers,
        };
    }
};
//# sourceMappingURL=handler.js.map