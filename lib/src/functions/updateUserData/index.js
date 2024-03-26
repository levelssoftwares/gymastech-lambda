import { handlerPath } from "@libs/handler-resolver";
export default {
    handler: `${handlerPath(__dirname)}/handler.updateUserData`,
    events: [
        {
            http: {
                method: "put",
                path: "users",
                cors: true,
            },
        },
    ],
};
//# sourceMappingURL=index.js.map