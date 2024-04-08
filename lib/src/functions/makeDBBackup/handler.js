import { MongoClient } from "mongodb";
import { S3 } from "aws-sdk";
import { MONGO_URI, headers, AWS_REGION, AWS_S3_BUCKET_NAME } from "src/utils/mongoConfig";
const ExcelJS = require('exceljs');
let backupCounter = 0;
export const backupToExcel = async (event) => {
    var _a;
    try {
        const dbName = (_a = event.queryStringParameters) === null || _a === void 0 ? void 0 : _a.dbName;
        const client = new MongoClient(MONGO_URI);
        await client.connect();
        const db = client.db(dbName);
        const collections = await db.listCollections().toArray();
        const workbook = new ExcelJS.Workbook();
        for (const collectionInfo of collections) {
            const collectionName = collectionInfo.name;
            const worksheet = workbook.addWorksheet(collectionName);
            const cursor = db.collection(collectionName).find();
            const collectionData = await cursor.toArray();
            const titles = Object.keys(collectionData[0]);
            worksheet.addRow(titles);
            collectionData.forEach(data => {
                worksheet.addRow(Object.values(data));
            });
        }
        await client.close();
        const buffer = await workbook.xlsx.writeBuffer();
        const s3 = new S3({ region: AWS_REGION });
        const fileName = `${dbName.toUpperCase()}_DB-${++backupCounter}.xlsx`;
        const params = {
            Bucket: AWS_S3_BUCKET_NAME,
            Key: fileName,
            Body: buffer,
            ContentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
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