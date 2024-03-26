import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.fetchAllCheckinsHandler`,
  events: [
    {
      http: {
        method: "get",
        path: "checkins",
        cors: true,
      },
    },
  ],
};