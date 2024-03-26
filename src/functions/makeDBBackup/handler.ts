import { APIGatewayProxyHandler } from "aws-lambda";
import { MongoClient } from "mongodb";
import { S3 } from "aws-sdk";
import { MONGO_URI, headers, AWS_REGION, AWS_S3_BUCKET_NAME } from "src/utils/mongoConfig";

const ExcelJS = require('exceljs');

let backupCounter = 0;

export const backupToExcel: APIGatewayProxyHandler = async (event) => {
  try {
    const dbName = event.queryStringParameters?.dbName;

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

      // Add a title row in the worksheet
      const titles = Object.keys(collectionData[0]);
      worksheet.addRow(titles);

      // Write data to the worksheet
      collectionData.forEach(data => {
        worksheet.addRow(Object.values(data));
      });
    }

    await client.close();

    // Save the Excel file in memory
    const buffer = await workbook.xlsx.writeBuffer();

    // Upload the file to S3
    const s3 = new S3({ region: AWS_REGION });
    const fileName = `${dbName.toUpperCase()}_DB-${++backupCounter}.xlsx`; // Naming convention
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
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: error.message || "Failed to create backup or upload to S3.",
      }),
      headers,
    };
  }
};
