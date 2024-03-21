import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.updateKanbanSales`,
  events: [
    {
      http: {
        method: "put",
        path: "kaban-sales",
        cors: true,
      },
    },
  ],
};