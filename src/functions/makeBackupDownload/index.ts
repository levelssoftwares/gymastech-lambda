import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.downloadBackupFromS3`,
  events: [
    {
      http: {
        method: "get",
        path: "backup-download",
        cors: true,
      },
    },
  ],
};