import { handlerPath } from "@libs/handler-resolver";
export default {
    handler: `${handlerPath(__dirname)}/handler.deleteKanbanSales`,
    events: [
        {
            http: {
                method: "delete",
                path: "kaban-sales",
                cors: true,
            },
        },
    ],
};
//# sourceMappingURL=index.js.map