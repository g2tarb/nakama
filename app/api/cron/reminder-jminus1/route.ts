import { NextResponse, type NextRequest } from 'next/server';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

import { serverConfig } from '@/lib/env';
import { listSeancesPendingReminder, markReminderSent } from '@/lib/queries/seances';
import { getProById } from '@/lib/queries/pros';
import { getSportifProfile } from '@/lib/queries/sportif';
import { sendBookingReminder } from '@/lib/email/send';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { clientConfig } from '@/lib/env';

/**
 * Vercel cron : Authorization: Bearer ${CRON_SECRET}
 * Configuré dans vercel.json — schedule "0 18 * * *" (18h UTC = 19/20h FR)
 */
export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (auth !== `Bearer ${serverConfig().CRON_SECRET}`) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const seances = await listSeancesPendingReminder();
  const admin = createSupabaseAdminClient();

  let sent = 0;
  let failed = 0;

  for (const seance of seances) {
    try {
      const pro = await getProById(seance.proId);
      const sportif = await getSportifProfile(seance.sportifId);
      if (!pro || !sportif) continue;

      const { data: sportifAuth } = await admin.auth.admin.getUserById(seance.sportifId);
      const email = sportifAuth?.user?.email;
      if (!email) {
        failed++;
        continue;
      }

      const heure = format(seance.dateDebut, 'HH:mm', { locale: fr });
      const detailUrl = `${clientConfig().NEXT_PUBLIC_APP_URL}/rdv`;

      const result = await sendBookingReminder(email, {
        prenom: sportif.prenom,
        partenaireNom: `${pro.prenom} ${pro.nom}`,
        heure,
        ...(seance.lieu ? { lieu: seance.lieu } : {}),
        detailUrl,
      });

      if (result.ok) {
        await markReminderSent(seance.id);
        sent++;
      } else {
        failed++;
      }
    } catch (err) {
      console.error('[cron reminder-jminus1] erreur seance', seance.id, err);
      failed++;
    }
  }

  return NextResponse.json({ ok: true, scanned: seances.length, sent, failed });
}
