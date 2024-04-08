import { S3 } from "aws-sdk";
import { headers, AWS_REGION, AWS_S3_BUCKET_NAME } from "src/utils/mongoConfig";
const allowedFileTypes = [
    "image/jpeg",
    "image/png",
    "application/pdf",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "video/mp4",
    "video/webm",
    "video/quicktime",
    "video/*",
];
export const uploadFilesToS3 = async (event) => {
    try {
        if (!event.body) {
            throw new Error('Files not provided.');
        }
        const { files } = JSON.parse(event.body);
        console.log('AAAA', files);
        if (!Array.isArray(files)) {
            throw new Error('Files must be an array.');
        }
        const s3 = new S3({ region: AWS_REGION });
        const uploadPromises = [];
        files.forEach((file) => {
            if (!allowedFileTypes.includes(file.type)) {
                throw new Error(`File type ${file.type} not allowed.`);
            }
            if (!file.data) {
                throw new Error(`File data not provided for ${file.name}.`);
            }
            const fileData = Buffer.from(file.data, 'base64');
            const params = {
                Bucket: AWS_S3_BUCKET_NAME,
                Key: file.name,
                Body: fileData,
                ContentType: file.type,
            };
            uploadPromises.push(s3.upload(params).promise());
        });
        await Promise.all(uploadPromises);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Files uploaded successfully." }),
            headers,
        };
    }
    catch (error) {
        console.error("Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: error.message || "Failed to upload files to S3." }),
            headers,
        };
    }
};
//# sourceMappingURL=handler.js.map