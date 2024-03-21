import { handlerPath } from "@libs/handler-resolver";
export default {
    handler: `${handlerPath(__dirname)}/handler.toggleUserStatus`,
    events: [
        {
            http: {
                method: "put",
                path: "disabled-user",
                cors: true,
            },
        },
    ],
};
//# sourceMappingURL=index.js.map