'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';

import { conversations, pros } from '@/lib/mock-data';
import { formatRelative } from '@/lib/formatters';

export default function MessagesPage() {
  const router = useRouter();

  return (
    <div className="px-4 py-6">
      <h1 className="text-accent-gold mb-6 text-xl font-bold">Messages</h1>

      <div className="space-y-1">
        {conversations.map((conv) => {
          const proId = conv.participants[0];
          const pro = pros.find((p) => p.id === proId);
          const lastMsg = conv.messages[conv.messages.length - 1];
          const nonLus = conv.nonLusSportif;

          return (
            <button
              key={conv.id}
              onClick={() => router.push(`/messages/${conv.id}`)}
              className="hover:bg-surface flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors"
            >
              {/* Photo */}
              <div className="relative size-12 shrink-0 overflow-hidden rounded-full">
                {pro && (
                  <Image
                    src={pro.photo}
                    alt={pro.prenom}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                )}
                {nonLus > 0 && (
                  <span className="bg-danger absolute -top-0.5 -right-0.5 flex size-5 items-center justify-center rounded-full text-[10px] font-bold text-white">
                    {nonLus}
                  </span>
                )}
              </div>

              {/* Contenu */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="truncate font-semibold">
                    {pro ? `${pro.prenom} ${pro.nom}` : 'Inconnu'}
                  </p>
                  <span className="text-text-tertiary ml-2 shrink-0 text-xs">
                    {lastMsg ? formatRelative(lastMsg.date) : ''}
                  </span>
                </div>
                <p className="text-text-secondary truncate text-sm">
                  {lastMsg?.contenu.slice(0, 50)}
                  {lastMsg && lastMsg.contenu.length > 50 ? '…' : ''}
                </p>
              </div>

              <ChevronRight size={16} className="text-text-tertiary shrink-0" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
