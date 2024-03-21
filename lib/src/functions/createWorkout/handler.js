import { MongoClient } from "mongodb";
import { MONGO_URI, headers } from "src/utils/mongoConfig";
export const createWorkout = async (event) => {
    var _a;
    const workoutEventData = JSON.parse(event.body);
    const dbName = (_a = event.queryStringParameters) === null || _a === void 0 ? void 0 : _a.dbName;
    try {
        const client = new MongoClient(MONGO_URI);
        await client.connect();
        await client
            .db(dbName)
            .collection("Workouts")
            .insertOne(workoutEventData);
        await client.close();
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Evento de treino salvo com sucesso.",
                insertedWorkoutEvent: workoutEventData,
            }),
            headers,
        };
    }
    catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: error.message || "Falha ao inserir evento de treino.",
            }),
            headers,
        };
    }
};
//# sourceMappingURL=handler.js.map