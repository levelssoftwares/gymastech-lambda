import { S3 } from "aws-sdk";
import { AWS_REGION, AWS_S3_BUCKET_NAME } from "src/utils/mongoConfig";
export const downloadBackupFromS3 = async (event) => {
    var _a;
    try {
        const fileName = (_a = event.queryStringParameters) === null || _a === void 0 ? void 0 : _a.fileName;
        if (!fileName) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: "Parâmetro 'fileName' ausente na solicitação.",
                }),
            };
        }
        const s3 = new S3({ region: AWS_REGION });
        const params = {
            Bucket: AWS_S3_BUCKET_NAME,
            Key: fileName,
        };
        const signedUrl = await s3.getSignedUrlPromise('getObject', params);
        return {
            statusCode: 200,
            body: JSON.stringify({
                fileName: fileName,
                downloadUrl: signedUrl,
            }),
        };
    }
    catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: error.message || "Erro ao gerar URL de download.",
            }),
        };
    }
};
//# sourceMappingURL=handler.js.map