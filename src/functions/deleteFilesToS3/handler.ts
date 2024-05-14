import { APIGatewayProxyHandler } from "aws-lambda";
import { S3 } from "aws-sdk";
import { MongoClient } from "mongodb";
import {
  headers,
  AWS_REGION,
  AWS_S3_BUCKET_NAME,
  MONGO_URI,
} from "src/utils/mongoConfig";

interface DeleteRequest {
  dbName?: string;
  fileNames?: string[];
}

export const deleteFilesFromS3: APIGatewayProxyHandler = async (event) => {
  const requestData: DeleteRequest = JSON.parse(event.body || "{}");
  const dbName = requestData.dbName;
  const fileNames = requestData.fileNames;

  try {
    if (!fileNames || !Array.isArray(fileNames) || fileNames.length === 0) {
      throw new Error("File names not provided or invalid.");
    }

    const s3 = new S3({ region: AWS_REGION });

    const deletePromises: Promise<any>[] = [];

    fileNames.forEach((fileName: string) => {
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
  } catch (error: any) {
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