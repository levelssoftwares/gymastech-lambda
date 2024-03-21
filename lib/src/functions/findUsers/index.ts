import { handlerPath } from "@libs/handler-resolver";
export default {
    handler: `${handlerPath(__dirname)}/handler.findDbUsers`,
    events: [
        {
            http: {
                method: "get",
                path: "find-db-users",
                cors: true,
            },
        },
    ],
};
//# sourceMappingURL=index.js.map