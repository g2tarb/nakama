import 'server-only';

import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { clientConfig, serverConfig } from '@/lib/env';
import { getR2Client } from './client';

export type SignedUploadResult = {
  uploadUrl: string;
  publicUrl: string;
  key: string;
};

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp']);

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

/**
 * Génère une URL signée PUT pour uploader un fichier directement depuis le client.
 * @param key    chemin dans le bucket, ex. `pros/{userId}/photo-{ts}.jpg`
 */
export async function createSignedUpload(input: {
  key: string;
  contentType: string;
  contentLength: number;
}): Promise<{ ok: true; data: SignedUploadResult } | { ok: false; error: string }> {
  if (!ALLOWED_MIME.has(input.contentType)) {
    return { ok: false, error: 'Type de fichier non autorisé (JPEG/PNG/WebP)' };
  }
  if (input.contentLength > MAX_BYTES) {
    return { ok: false, error: 'Fichier trop lourd (max 5 MB)' };
  }

  const { R2_BUCKET_NAME } = serverConfig();
  const cmd = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: input.key,
    ContentType: input.contentType,
    ContentLength: input.contentLength,
  });
  const uploadUrl = await getSignedUrl(getR2Client(), cmd, { expiresIn: 60 * 5 });
  const publicUrl = `${clientConfig().NEXT_PUBLIC_R2_PUBLIC_URL.replace(/\/$/, '')}/${input.key}`;

  return { ok: true, data: { uploadUrl, publicUrl, key: input.key } };
}

/** Construit une clé d'objet R2 cohérente. */
export function buildPhotoKey(userId: string, kind: 'pro' | 'sportif' = 'pro') {
  const ts = Date.now();
  return `${kind}s/${userId}/photo-${ts}.webp`;
}
