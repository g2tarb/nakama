import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';

import { requireUser } from '@/lib/auth/session';
import { buildPhotoKey, createSignedUpload } from '@/lib/r2/upload';

const bodySchema = z.object({
  contentType: z.string().min(1),
  contentLength: z.number().int().positive(),
  kind: z.enum(['pro', 'sportif']).default('pro'),
});

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    const json = await req.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: 'Body invalide' }, { status: 400 });
    }
    const key = buildPhotoKey(user.id, parsed.data.kind);
    const result = await createSignedUpload({
      key,
      contentType: parsed.data.contentType,
      contentLength: parsed.data.contentLength,
    });
    if (!result.ok) {
      return NextResponse.json(result, { status: 400 });
    }
    return NextResponse.json(result);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Erreur inconnue';
    const status = msg === 'UNAUTHORIZED' ? 401 : 500;
    return NextResponse.json({ ok: false, error: msg }, { status });
  }
}
