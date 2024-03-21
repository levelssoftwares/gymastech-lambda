import { handlerPath } from "@libs/handler-resolver";
export default {
    handler: `${handlerPath(__dirname)}/handler.fetchAllEventsHandler`,
    events: [
        {
            http: {
                method: "get",
                path: "fetch-event",
                cors: true,
            },
        },
    ],
};
//# sourceMappingURL=index.js.map