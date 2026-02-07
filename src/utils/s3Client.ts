import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const REGION = process.env.AWS_REGION || "us-east-1";

const s3Client = new S3Client({ region: REGION });

export async function uploadObject(
  bucket: string,
  key: string,
  body: string | Buffer,
) {
  try {
    const cmd = new PutObjectCommand({ Bucket: bucket, Key: key, Body: body });
    const response = await s3Client.send(cmd);
    return response;
  } catch (err) {
    console.error("uploadObject error", err);
    throw err;
  }
}

export async function downloadObject(
  bucket: string,
  key: string,
): Promise<string> {
  try {
    const cmd = new GetObjectCommand({ Bucket: bucket, Key: key });
    const resp = await s3Client.send(cmd);
    // resp.Body can be a stream in Node.js
    if (!resp.Body) return "";
    // @ts-ignore
    const bodyString = await resp.Body.transformToString();
    return bodyString;
  } catch (err) {
    console.error("downloadObject error", err);
    throw err;
  }
}

export async function getPresignedUrl(
  bucket: string,
  key: string,
  expiresIn = 3600,
  method: "put" | "get" = "put",
): Promise<string> {
  try {
    const cmd =
      method === "put"
        ? new PutObjectCommand({ Bucket: bucket, Key: key })
        : new GetObjectCommand({ Bucket: bucket, Key: key });
    const url = await getSignedUrl(s3Client, cmd, { expiresIn });
    return url;
  } catch (err) {
    console.error("getPresignedUrl error", err);
    throw err;
  }
}
