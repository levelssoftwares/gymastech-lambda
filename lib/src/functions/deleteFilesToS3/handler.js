import { S3 } from "aws-sdk";
import { MongoClient } from "mongodb";
import { headers, REGION_NAME, AWS_S3_BUCKET_NAME, MONGO_URI, } from "src/utils/mongoConfig";
export const deleteFilesFromS3 = async (event) => {
    const requestData = JSON.parse(event.body || "{}");
    const dbName = requestData.dbName;
    const fileNames = requestData.fileNames;
    try {
        if (!fileNames || !Array.isArray(fileNames) || fileNames.length === 0) {
            throw new Error("File names not provided or invalid.");
        }
        const s3 = new S3({ region: REGION_NAME });
        const deletePromises = [];
        fileNames.forEach((fileName) => {
            const params = {
                Bucket: AWS_S3_BUCKET_NAME,
                Key: fileName,
            };
            deletePromises.push(s3.deleteObject(params).promise());
        });
        await Promise.all(deletePromises);
        const client = new MongoClient(MONGO_URI);
        await client.connect();
        const db = client.db(dbName);
        const documentsCollection = db.collection("Documents");
        await documentsCollection.deleteMany({ name: { $in: fileNames } });
        await client.close();
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Files deleted successfully." }),
            headers,
        };
    }
    catch (error) {
        console.error("Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: error.message || "Failed to delete files from S3.",
            }),
            headers,
        };
    }
};
//# sourceMappingURL=handler.js.map