import { APIGatewayProxyHandler } from "aws-lambda";
import { S3ActionRequest } from "../../interfaces";
import {
  uploadObject,
  downloadObject,
  getPresignedUrl,
} from "../../utils/s3Client";

const BUCKET = process.env.BUCKET as string;

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const body = event.body
      ? (JSON.parse(event.body) as S3ActionRequest)
      : null;
    if (!body) return { statusCode: 400, body: "missing body" };

    const { action, key, body: data } = body;

    if (action === "upload") {
      if (!data) return { statusCode: 400, body: "missing data" };
      await uploadObject(BUCKET, key, data);
      return { statusCode: 200, body: "uploaded" };
    }

    if (action === "download") {
      const file = await downloadObject(BUCKET, key);
      return { statusCode: 200, body: file };
    }

    if (action === "presign") {
      const url = await getPresignedUrl(BUCKET, key, 3600, "put");
      return { statusCode: 200, body: JSON.stringify({ url }) };
    }

    return { statusCode: 400, body: "unknown action" };
  } catch (err) {
    console.error("uploadS3 handler error", err);
    return { statusCode: 500, body: "internal error" };
  }
};
