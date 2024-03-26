import { handlerPath } from "@libs/handler-resolver";
export default {
    handler: `${handlerPath(__dirname)}/handler.backupToExcel`,
    events: [
        {
            http: {
                method: "get",
                path: "db-backup",
                cors: true,
            },
        },
    ],
};
//# sourceMappingURL=index.js.map