'use client';

import { motion } from 'framer-motion';

const ITEMS = [
  {
    name: 'Sofia M.',
    activity: 'Course à pied',
    quote:
      'J’ai trouvé le bon coach en 10 minutes. La précision du matching m’a surprise.',
  },
  {
    name: 'Antoine L.',
    activity: 'Musculation',
    quote:
      'Pas de chichi, pas de blabla. Direct et efficace, comme le coach qu’on m’a proposé.',
  },
  {
    name: 'Léa C.',
    activity: 'Yoga',
    quote:
      'Ce qui change, c’est l’alignement de personnalité. Mon coach me comprend vraiment.',
  },
];

export function Testimonials() {
  return (
    <section className="px-4 py-24">
      <div className="mx-auto max-w-[1080px]">
        <div className="mb-14 text-center">
          <span className="nk-eyebrow">Témoignages</span>
          <h2 className="nk-h1 text-text-primary mt-3">Ils ont trouvé leur Nakama</h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {ITEMS.map((t, i) => (
            <motion.article
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1],
                delay: i * 0.12,
              }}
              whileHover={{ y: -4 }}
              className="bg-card border-border/40 rounded-xl border p-6"
            >
              <p className="text-text-primary mb-5 text-[15px] leading-relaxed">
                « {t.quote} »
              </p>
              <div className="flex items-center gap-2.5">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold"
                  style={{
                    background: 'linear-gradient(135deg,#262626,#131313)',
                    color: 'rgba(229,181,71,0.5)',
                  }}
                >
                  {t.name
                    .split(' ')
                    .map((w) => w[0])
                    .join('')}
                </div>
                <div>
                  <div className="text-text-primary text-[13px] font-semibold">
                    {t.name}
                  </div>
                  <div className="text-text-tertiary text-xs">{t.activity}</div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
