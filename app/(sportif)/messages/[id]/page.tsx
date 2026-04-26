'use client';

import { use, useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Send } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

import { cn } from '@/lib/utils';
import { conversations, pros } from '@/lib/mock-data';

export default function ConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState('');

  const conv = conversations.find((c) => c.id === id);
  const proId = conv?.participants[0];
  const pro = pros.find((p) => p.id === proId);
  const sportifId = conv?.participants[1] ?? '';

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [conv]);

  if (!conv) {
    return (
      <div className="flex flex-col items-center py-20">
        <p className="text-text-secondary">Conversation introuvable</p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-7.5rem)] flex-col md:h-[calc(100vh-3.5rem)]">
      {/* Header conversation */}
      <div className="border-border flex items-center gap-3 border-b px-4 py-3">
        <button
          onClick={() => router.back()}
          className="text-text-secondary hover:text-text-primary"
        >
          <ArrowLeft size={20} />
        </button>
        {pro && (
          <div className="relative size-9 overflow-hidden rounded-full">
            <Image
              src={pro.photo}
              alt={pro.prenom}
              fill
              sizes="36px"
              className="object-cover"
            />
          </div>
        )}
        <p className="font-semibold">{pro ? `${pro.prenom} ${pro.nom}` : 'Inconnu'}</p>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
        {conv.messages.map((msg) => {
          const isUser = msg.auteurId === sportifId;
          return (
            <div
              key={msg.id}
              className={cn('flex', isUser ? 'justify-end' : 'justify-start')}
            >
              <div
                className={cn(
                  'max-w-[80%] rounded-2xl px-4 py-2.5',
                  isUser
                    ? 'bg-accent-gold/20 text-text-primary rounded-br-md'
                    : 'bg-surface text-text-primary rounded-bl-md',
                )}
              >
                <p className="text-sm">{msg.contenu}</p>
                <p className="text-text-tertiary mt-1 text-right text-[10px]">
                  {format(new Date(msg.date), 'HH:mm', { locale: fr })}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className="border-border border-t px-4 py-3">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Écris un message..."
            className="border-border bg-surface focus:border-accent-gold focus:ring-accent-gold/30 h-10 flex-1 rounded-full border px-4 text-sm focus:ring-2 focus:outline-none"
          />
          <button className="bg-accent-gold text-background flex size-10 items-center justify-center rounded-full transition-transform hover:scale-105">
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
