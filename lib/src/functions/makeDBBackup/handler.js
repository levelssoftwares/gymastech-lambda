import { MongoClient } from "mongodb";
import { S3 } from "aws-sdk";
import { MONGO_URI, headers, AWS_REGION, AWS_S3_BUCKET_NAME } from "src/utils/mongoConfig";
export const backupToExcel = async (event) => {
    var _a;
    try {
        const dbName = (_a = event.queryStringParameters) === null || _a === void 0 ? void 0 : _a.dbName;
        const client = new MongoClient(MONGO_URI);
        await client.connect();
        const db = client.db(dbName);
        const collections = await db.listCollections().toArray();
        const tasks = [];
        for (const collectionInfo of collections) {
            const collectionName = collectionInfo.name;
            const cursor = db.collection(collectionName).find();
            const collectionData = await cursor.toArray();
            tasks.push(...collectionData);
        }
        await client.close();
        const csvData = tasks.map(task => Object.values(task).join(',')).join('\n');
        const s3 = new S3({ region: AWS_REGION });
        const fileName = `backup-${Date.now()}.csv`;
        const params = {
            Bucket: AWS_S3_BUCKET_NAME,
            Key: fileName,
            Body: csvData,
            ContentType: 'text/csv'
        };
        await s3.upload(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Backup successfully created and uploaded to S3.",
                fileName: fileName
            }),
            headers,
        };
    }
    catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: error.message || "Failed to create backup or upload to S3.",
            }),
            headers,
        };
    }
};
//# sourceMappingURL=handler.js.map