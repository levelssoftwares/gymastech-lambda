import { handlerPath } from "@libs/handler-resolver";
export default {
    handler: `${handlerPath(__dirname)}/handler.uploadFilesToS3`,
    events: [
        {
            http: {
                method: "post",
                path: "upload-s3",
                cors: true,
            },
        },
    ],
};
//# sourceMappingURL=index.js.map