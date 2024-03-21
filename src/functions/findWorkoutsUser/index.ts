import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.findWorkoutsUser`,
  events: [
    {
      http: {
        method: "get",
        path: "create-workout",
        cors: true,
      },
    },
  ],
};