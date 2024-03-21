import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.createWorkout`,
  events: [
    {
      http: {
        method: "post",
        path: "create-workout",
        cors: true,
      },
    },
  ],
};