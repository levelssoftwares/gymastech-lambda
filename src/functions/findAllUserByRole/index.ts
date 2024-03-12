import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.findUsersByDatabaseAndRole`,
  events: [
    {
      http: {
        method: "get",
        path: "find-users-id",
        cors: true,
      },
    },
  ],
};