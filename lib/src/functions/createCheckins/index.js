import { handlerPath } from "@libs/handler-resolver";
export default {
    handler: `${handlerPath(__dirname)}/handler.createCheckins`,
    events: [
        {
            http: {
                method: "post",
                path: "checkins",
                cors: true,
            },
        },
    ],
};
//# sourceMappingURL=index.js.map