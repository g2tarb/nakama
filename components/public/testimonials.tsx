'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

const ITEMS = [
  {
    name: 'Sofia M.',
    activity: 'Course à pied',
    quote:
      'J’ai trouvé le bon coach en 10 minutes. La précision du matching m’a surprise.',
    image: '/images/testimonials/nakama1.webp',
  },
  {
    name: 'Antoine L.',
    activity: 'Musculation',
    quote:
      'Pas de chichi, pas de blabla. Direct et efficace, comme le coach qu’on m’a proposé.',
    image: '/images/testimonials/nakama2.webp',
  },
  {
    name: 'Léa C.',
    activity: 'Yoga',
    quote:
      'Ce qui change, c’est l’alignement de personnalité. Mon coach me comprend vraiment.',
    image: '/images/testimonials/nakama3.webp',
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
              className="bg-card border-border/40 group/card overflow-hidden rounded-xl border"
            >
              <motion.div
                initial={{ opacity: 0, scale: 1.06 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1],
                  delay: i * 0.12 + 0.15,
                }}
                className="relative aspect-[4/3] w-full overflow-hidden"
              >
                <Image
                  src={t.image}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover/card:scale-105"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(30,42,58,0) 40%, rgba(30,42,58,0.55) 100%)',
                  }}
                />
              </motion.div>

              <div className="p-6">
                <p className="text-text-primary mb-5 text-[15px] leading-relaxed">
                  « {t.quote} »
                </p>
                <div className="flex items-center gap-2.5">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold"
                    style={{
                      background: 'linear-gradient(135deg,#34465e,#1c2737)',
                      color: 'rgba(201,178,122,0.5)',
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
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
