import { handlerPath } from "@libs/handler-resolver";
export default {
    handler: `${handlerPath(__dirname)}/handler.deleteFilesFromS3`,
    events: [
        {
            http: {
                method: "delete",
                path: "upload-s3",
                cors: true,
            },
        },
    ],
};
//# sourceMappingURL=index.js.map