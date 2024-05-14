import { APIGatewayProxyHandler } from "aws-lambda";
import { S3 } from "aws-sdk";
import { REGION_NAME, AWS_S3_BUCKET_NAME } from "src/utils/mongoConfig";

export const downloadBackupFromS3: APIGatewayProxyHandler = async (event) => {
  try {
    const fileName = event.queryStringParameters?.fileName;

    if (!fileName) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Parâmetro 'fileName' ausente na solicitação.",
        }),
      };
    }

    const s3 = new S3({ region: REGION_NAME });
    const params = {
      Bucket: AWS_S3_BUCKET_NAME,
      Key: fileName,
    };

    const signedUrl = await s3.getSignedUrlPromise('getObject', params);

    return {
      statusCode: 200,
      body: JSON.stringify({
        fileName: fileName, // Aqui incluímos o nome do arquivo na resposta
        downloadUrl: signedUrl,
      }),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: error.message || "Erro ao gerar URL de download.",
      }),
    };
  }
};
