import { handlerPath } from "@libs/handler-resolver";
export default {
    handler: `${handlerPath(__dirname)}/handler.fetchKanbanSales`,
    events: [
        {
            http: {
                method: "get",
                path: "kaban-sales",
                cors: true,
            },
        },
    ],
};
//# sourceMappingURL=index.js.map