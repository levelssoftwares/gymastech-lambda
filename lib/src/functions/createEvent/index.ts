import { handlerPath } from "@libs/handler-resolver";
export default {
    handler: `${handlerPath(__dirname)}/handler.createEvent`,
    events: [
        {
            http: {
                method: "post",
                path: "create-event",
                cors: true,
            },
        },
    ],
};
//# sourceMappingURL=index.js.map