import { handlerPath } from "@libs/handler-resolver";
export default {
    handler: `${handlerPath(__dirname)}/handler.findDocuments`,
    events: [
        {
            http: {
                method: "get",
                path: "upload-s3",
                cors: true,
            },
        },
    ],
};
//# sourceMappingURL=index.js.map