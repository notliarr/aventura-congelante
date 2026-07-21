import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const R2_PREFIX = "r2:";

function getConfig() {
  const accountId = process.env.R2_ACCOUNT_ID?.trim();
  const accessKeyId = process.env.R2_ACCESS_KEY_ID?.trim();
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY?.trim();
  const bucket = process.env.R2_BUCKET_NAME?.trim();
  const publicUrl = process.env.R2_PUBLIC_URL?.trim().replace(/\/+$/, "");
  if (!accountId || !accessKeyId || !secretAccessKey || !bucket || !publicUrl) return null;
  return { accountId, accessKeyId, secretAccessKey, bucket, publicUrl };
}

function createClient(config: NonNullable<ReturnType<typeof getConfig>>) {
  return new S3Client({
    region: "auto",
    endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId: config.accessKeyId, secretAccessKey: config.secretAccessKey },
  });
}

export function isR2Configured() {
  return getConfig() !== null;
}

export function isR2StoragePath(storagePath: string) {
  return storagePath.startsWith(R2_PREFIX);
}

export async function uploadPhotoToR2(key: string, file: File) {
  const config = getConfig();
  if (!config) throw new Error("R2 não configurado.");
  await createClient(config).send(new PutObjectCommand({
    Bucket: config.bucket,
    Key: key,
    Body: Buffer.from(await file.arrayBuffer()),
    ContentType: file.type,
    CacheControl: "public, max-age=31536000, immutable",
  }));
  return { storagePath: `${R2_PREFIX}${key}`, publicUrl: `${config.publicUrl}/${key}` };
}

export async function deletePhotoFromR2(storagePath: string) {
  const config = getConfig();
  if (!config) throw new Error("R2 não configurado.");
  const key = storagePath.slice(R2_PREFIX.length);
  await createClient(config).send(new DeleteObjectCommand({ Bucket: config.bucket, Key: key }));
}
