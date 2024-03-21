import { handlerPath } from "@libs/handler-resolver";
export default {
    handler: `${handlerPath(__dirname)}/handler.addWorkoutExercise`,
    events: [
        {
            http: {
                method: "get",
                path: "exercises",
                cors: true,
            },
        },
    ],
};
//# sourceMappingURL=index.js.map