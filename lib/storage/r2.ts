import { DeleteObjectCommand, HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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
    requestChecksumCalculation: "WHEN_REQUIRED",
  });
}

export function isR2Configured() {
  return getConfig() !== null;
}

export function isR2StoragePath(storagePath: string) {
  return storagePath.startsWith(R2_PREFIX);
}

export function describeR2Error(error: unknown) {
  const value = error && typeof error === "object" ? error as { name?: string; message?: string; $metadata?: { httpStatusCode?: number } } : null;
  const name = value?.name ?? "Erro desconhecido";
  const status = value?.$metadata?.httpStatusCode;
  console.error("Falha no Cloudflare R2", { name, status, message: value?.message });

  if (["InvalidAccessKeyId", "SignatureDoesNotMatch", "CredentialsProviderError"].includes(name)) {
    return "O R2 recusou as credenciais. Confira Access Key ID, Secret Access Key e Account ID na Vercel.";
  }
  if (["AccessDenied", "Forbidden"].includes(name) || status === 401 || status === 403) {
    return "O token do R2 não tem acesso de leitura/gravação ao bucket aventura-congelante.";
  }
  if (name === "NoSuchBucket" || status === 404) {
    return "O bucket do R2 não foi encontrado. Confira R2_BUCKET_NAME e R2_ACCOUNT_ID.";
  }
  return `O R2 falhou ao receber a foto (${name}). Confira as configurações do bucket.`;
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

export async function createPresignedPhotoUpload(key: string, contentType: string) {
  const config = getConfig();
  if (!config) throw new Error("R2 não configurado.");
  const uploadUrl = await getSignedUrl(createClient(config), new PutObjectCommand({
    Bucket: config.bucket,
    Key: key,
    ContentType: contentType,
    CacheControl: "public, max-age=31536000, immutable",
  }), { expiresIn: 5 * 60 });
  return { uploadUrl, storagePath: `${R2_PREFIX}${key}`, publicUrl: `${config.publicUrl}/${key}` };
}

export async function getR2PhotoMetadata(storagePath: string) {
  const config = getConfig();
  if (!config) throw new Error("R2 não configurado.");
  const key = storagePath.slice(R2_PREFIX.length);
  const result = await createClient(config).send(new HeadObjectCommand({ Bucket: config.bucket, Key: key }));
  return { size: result.ContentLength ?? 0, contentType: result.ContentType ?? "" };
}

export async function deletePhotoFromR2(storagePath: string) {
  const config = getConfig();
  if (!config) throw new Error("R2 não configurado.");
  const key = storagePath.slice(R2_PREFIX.length);
  await createClient(config).send(new DeleteObjectCommand({ Bucket: config.bucket, Key: key }));
}
