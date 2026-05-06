import 'server-only';

import { S3Client } from '@aws-sdk/client-s3';

import { serverConfig } from '@/lib/env';

let cached: S3Client | null = null;

export function getR2Client() {
  if (cached) return cached;
  const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY } = serverConfig();
  cached = new S3Client({
    region: 'auto',
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
  });
  return cached;
}
