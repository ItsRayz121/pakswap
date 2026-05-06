import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { randomUUID } from 'crypto'

const s3 = new S3Client({
  region: process.env.AWS_REGION ?? 'ap-south-1',
  ...(process.env.AWS_ENDPOINT_URL
    ? {
        endpoint: process.env.AWS_ENDPOINT_URL,
        forcePathStyle: true,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? 'test',
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? 'test',
        },
      }
    : {}),
})

export async function uploadFile(
  bucket: string,
  prefix: string,
  buffer: Buffer,
  mimeType: string,
): Promise<string> {
  const key = `${prefix}/${randomUUID()}`
  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
      ServerSideEncryption: 'aws:kms',
    }),
  )
  return key
}

export async function getPresignedUrl(bucket: string, key: string, expirySeconds = 300): Promise<string> {
  const cmd = new GetObjectCommand({ Bucket: bucket, Key: key })
  return getSignedUrl(s3, cmd, { expiresIn: expirySeconds })
}

export const KYC_BUCKET = process.env.S3_BUCKET_KYC ?? 'pakswap-kyc-documents'
export const SCREENSHOTS_BUCKET = process.env.S3_BUCKET_SCREENSHOTS ?? 'pakswap-screenshots'
