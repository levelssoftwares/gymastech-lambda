import { APIGatewayProxyHandler } from "aws-lambda";
import { S3 } from "aws-sdk";
import { headers, AWS_REGION, AWS_S3_BUCKET_NAME } from "src/utils/mongoConfig";

interface FileObject {
  name: string;
  size: number;
  type: string;
  data: string; // Assuming the file data is received as a base64-encoded string
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
  try {
    // Verifica se 'files' está presente na requisição
    if (!event.body) {
      throw new Error('Files not provided.');
    }

    // Parse o corpo da requisição para extrair os arquivos
    const { files } = JSON.parse(event.body);
      console.log('AAAA', files)
    // Verifica se 'files' é um array
    if (!Array.isArray(files)) {
      throw new Error('Files must be an array.');
    }

    // Crie uma instância do serviço S3
    const s3 = new S3({ region: AWS_REGION });

    // Array para armazenar promessas de uploads
    const uploadPromises: Promise<any>[] = [];

    // Itera sobre cada arquivo para upload
    files.forEach((file: FileObject) => {
      if (!allowedFileTypes.includes(file.type)) {
        throw new Error(`File type ${file.type} not allowed.`);
      }

      // Verifica se 'file.data' está presente
      if (!file.data) {
        throw new Error(`File data not provided for ${file.name}.`);
      }

      // Decode os dados do arquivo base64
      const fileData = Buffer.from(file.data, 'base64');

      // Parâmetros para o upload no S3
      const params = {
        Bucket: AWS_S3_BUCKET_NAME,
        Key: file.name,
        Body: fileData,
        ContentType: file.type,
      };

      // Adiciona a promessa de upload ao array
      uploadPromises.push(s3.upload(params).promise());
    });

    // Aguarde todos os uploads serem concluídos
    await Promise.all(uploadPromises);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Files uploaded successfully." }),
      headers,
    };
  } catch (error: any) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message || "Failed to upload files to S3." }),
      headers,
    };
  }
};
