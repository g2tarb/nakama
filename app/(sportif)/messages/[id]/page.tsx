'use client';

import { use, useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Send } from 'lucide-react';
import { format, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';

import { cn } from '@/lib/utils';
import { conversations, pros } from '@/lib/mock-data';
import type { Message } from '@/types';

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

  const [messages, setMessages] = useState<Message[]>(conv?.messages ?? []);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      auteurId: sportifId,
      contenu: trimmed,
      date: new Date().toISOString(),
      lu: false,
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputValue('');
  }

  if (!conv) {
    return (
      <div className="flex flex-col items-center py-20">
        <p className="text-text-secondary">Conversation introuvable</p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-9rem)] flex-col md:h-[calc(100vh-3.5rem)]">
      <div className="border-border/60 bg-background/85 flex items-center gap-3 border-b px-4 py-3 backdrop-blur-md">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Retour"
          className="text-text-secondary hover:text-text-primary hover:bg-card -ml-1 flex h-9 w-9 items-center justify-center rounded-full transition-colors active:translate-y-px"
        >
          <ArrowLeft size={18} />
        </button>
        {pro && (
          <div className="relative h-9 w-9 overflow-hidden rounded-full">
            <Image
              src={pro.photo}
              alt={pro.prenom}
              fill
              sizes="36px"
              className="object-cover"
            />
            <span
              aria-hidden="true"
              className="bg-success ring-background absolute right-0 bottom-0 h-2 w-2 rounded-full ring-2"
            />
          </div>
        )}
        <div className="min-w-0">
          <div className="text-text-primary truncate text-[14.5px] font-semibold">
            {pro ? `${pro.prenom} ${pro.nom}` : 'Inconnu'}
          </div>
          <div className="text-text-tertiary text-[11px]">En ligne</div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5">
        {messages.map((msg, i) => {
          const isUser = msg.auteurId === sportifId;
          const prev = messages[i - 1];
          const date = new Date(msg.date);
          const showDateSeparator = !prev || !isSameDay(new Date(prev.date), date);
          const isClusterStart = !prev || prev.auteurId !== msg.auteurId;
          return (
            <div key={msg.id}>
              {showDateSeparator && (
                <div className="my-4 flex items-center gap-3">
                  <div className="bg-border/60 h-px flex-1" />
                  <span className="text-text-tertiary text-[11px] font-medium tracking-[0.06em] uppercase">
                    {format(date, 'd MMMM', { locale: fr })}
                  </span>
                  <div className="bg-border/60 h-px flex-1" />
                </div>
              )}
              <div
                className={cn(
                  'flex',
                  isUser ? 'justify-end' : 'justify-start',
                  isClusterStart ? 'mt-3' : 'mt-1',
                )}
              >
                <div
                  className={cn(
                    'max-w-[78%] px-4 py-2.5 text-[14px] leading-snug',
                    isUser
                      ? 'bg-primary text-primary-foreground rounded-2xl rounded-br-md'
                      : 'bg-card text-text-primary rounded-2xl rounded-bl-md',
                  )}
                >
                  <p>{msg.contenu}</p>
                  <p
                    className={cn(
                      'mt-1 text-right text-[10px] tabular-nums',
                      isUser ? 'text-primary-foreground/70' : 'text-text-tertiary',
                    )}
                  >
                    {format(date, 'HH:mm', { locale: fr })}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <form
        onSubmit={handleSend}
        className="border-border/60 bg-background/90 border-t px-4 py-3 backdrop-blur-md"
      >
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Écris un message…"
            className="border-border/60 bg-card focus:border-accent-muted focus:ring-accent-gold/15 text-text-primary placeholder:text-text-tertiary h-11 flex-1 rounded-full border px-4 text-[14px] focus:ring-3 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="bg-primary text-primary-foreground hover:bg-accent-gold-hover flex h-11 w-11 items-center justify-center rounded-full transition-all hover:-translate-y-px active:translate-y-px disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
            aria-label="Envoyer"
          >
            <Send size={17} />
          </button>
        </div>
      </form>
    </div>
  );
}
