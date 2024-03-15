import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.deleteEvent`,
  events: [
    {
      http: {
        method: "delete",
        path: "delete-event",
        cors: true,
      },
    },
  ],
};