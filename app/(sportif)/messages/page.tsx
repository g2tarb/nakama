'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

import { conversations, pros } from '@/lib/mock-data';
import { formatRelative } from '@/lib/formatters';
import { cn } from '@/lib/utils';

export default function MessagesPage() {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-[480px] px-4 pt-6 pb-8 md:max-w-[640px]">
      <h1 className="nk-h1 text-text-primary mb-5 tracking-[-0.02em]">Messages</h1>

      {conversations.length === 0 ? (
        <p className="text-text-tertiary py-12 text-center text-sm">
          Aucune conversation pour le moment.
        </p>
      ) : (
        <ul className="flex flex-col">
          {conversations.map((conv, index) => {
            const proId = conv.participants[0];
            const pro = pros.find((p) => p.id === proId);
            const lastMsg = conv.messages[conv.messages.length - 1];
            const nonLus = conv.nonLusSportif;
            const isUnread = nonLus > 0;

            return (
              <li
                key={conv.id}
                className={cn(
                  'border-border/40',
                  index !== conversations.length - 1 && 'border-b',
                )}
              >
                <button
                  type="button"
                  onClick={() => router.push(`/messages/${conv.id}`)}
                  className="hover:bg-card group flex w-full items-center gap-3 rounded-xl px-2 py-3 text-left transition-colors"
                >
                  <div className="relative h-12 w-12 shrink-0">
                    {pro && (
                      <div className="relative h-12 w-12 overflow-hidden rounded-full">
                        <Image
                          src={pro.photo}
                          alt={pro.prenom}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                    )}
                    {isUnread && (
                      <span
                        aria-label={`${nonLus} message${nonLus > 1 ? 's' : ''} non lu${nonLus > 1 ? 's' : ''}`}
                        className="bg-accent-gold ring-background absolute -top-0.5 -right-0.5 flex h-5 min-w-[20px] items-center justify-center rounded-full px-1 text-[10px] font-bold text-[var(--color-background)] ring-2"
                      >
                        {nonLus}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p
                        className={cn(
                          'truncate text-[14.5px]',
                          isUnread
                            ? 'text-text-primary font-semibold'
                            : 'text-text-primary font-medium',
                        )}
                      >
                        {pro ? `${pro.prenom} ${pro.nom}` : 'Inconnu'}
                      </p>
                      <span
                        className={cn(
                          'shrink-0 text-[11px]',
                          isUnread
                            ? 'text-accent-gold font-semibold'
                            : 'text-text-tertiary',
                        )}
                      >
                        {lastMsg ? formatRelative(lastMsg.date) : ''}
                      </span>
                    </div>
                    <p
                      className={cn(
                        'mt-0.5 truncate text-[13px]',
                        isUnread ? 'text-text-primary' : 'text-text-tertiary',
                      )}
                    >
                      {lastMsg?.contenu.slice(0, 60)}
                      {lastMsg && lastMsg.contenu.length > 60 ? '…' : ''}
                    </p>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
