import { S3Client } from "@aws-sdk/client-s3";

export const storageBucket = process.env.YC_STORAGE_BUCKET!;

export const s3 = new S3Client({
  region: process.env.YC_STORAGE_REGION || "ru-central1",
  endpoint: process.env.YC_STORAGE_ENDPOINT,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.YC_STORAGE_ACCESS_KEY_ID!,
    secretAccessKey: process.env.YC_STORAGE_SECRET_ACCESS_KEY!,
  },
});