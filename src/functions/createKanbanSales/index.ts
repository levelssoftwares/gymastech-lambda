import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.createKanbanSales`,
  events: [
    {
      http: {
        method: "post",
        path: "kaban-sales",
        cors: true,
      },
    },
  ],
};