import { handlerPath } from "@libs/handler-resolver";
export default {
    handler: `${handlerPath(__dirname)}/handler.updateCheckouts`,
    events: [
        {
            http: {
                method: "put",
                path: "checkins",
                cors: true,
            },
        },
    ],
};
//# sourceMappingURL=index.js.map