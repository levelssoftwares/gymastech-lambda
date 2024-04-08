import { APIGatewayProxyHandler } from "aws-lambda";
import { S3 } from "aws-sdk";
import { MongoClient } from "mongodb";
import {
  headers,
  AWS_REGION,
  AWS_S3_BUCKET_NAME,
  MONGO_URI,
} from "src/utils/mongoConfig";

interface FileObject {
  name: string;
  size: number;
  type: string;
  data: string;
}

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

export const uploadFilesToS3: APIGatewayProxyHandler = async (event) => {
  const dbName = event.queryStringParameters?.dbName;
  try {
    if (!event.body) {
      throw new Error("Files not provided.");
    }

    const { files } = JSON.parse(event.body);
    if (!Array.isArray(files)) {
      throw new Error("Files must be an array.");
    }

    const s3 = new S3({ region: AWS_REGION });

    const uploadPromises: Promise<any>[] = [];
    const uploadedFilesDetails: any[] = [];

    files.forEach((file: FileObject) => {
      if (!allowedFileTypes.includes(file.type)) {
        throw new Error(`File type ${file.type} not allowed.`);
      }

      if (!file.data) {
        throw new Error(`File data not provided for ${file.name}.`);
      }

      const fileData = Buffer.from(file.data, "base64");

      const params = {
        Bucket: AWS_S3_BUCKET_NAME,
        Key: file.name,
        Body: fileData,
        ContentType: file.type,
      };

      uploadPromises.push(
        s3
          .upload(params)
          .promise()
          .then((data: any) => {
            uploadedFilesDetails.push({
              name: file.name,
              uploadDate: new Date().toISOString(),
              type: file.type,
              url: data.Location,
            });
          })
      );
    });

    await Promise.all(uploadPromises);

    const client = new MongoClient(MONGO_URI);
    await client.connect();
    const db = client.db(dbName);

    const documentsCollection = db.collection("Documents");
    await documentsCollection.insertMany(uploadedFilesDetails);

    await client.close();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Files uploaded successfully." }),
      headers,
    };
  } catch (error: any) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: error.message || "Failed to upload files to S3.",
      }),
      headers,
    };
  }
};
