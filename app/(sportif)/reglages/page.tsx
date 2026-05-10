'use client';

import { useState } from 'react';
import { Bell, ChevronRight, Download, Globe, Lock, Trash2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

import { containerVariants, itemVariants } from '@/lib/animations';
import { cn } from '@/lib/utils';

type ToggleKey = 'pushRdv' | 'pushMatch' | 'emailRappel' | 'emailNewsletter';

export default function ParametresSportifPage() {
  const [toggles, setToggles] = useState<Record<ToggleKey, boolean>>({
    pushRdv: true,
    pushMatch: true,
    emailRappel: true,
    emailNewsletter: false,
  });

  const setToggle = (key: ToggleKey) =>
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mx-auto w-full max-w-[480px] px-4 py-6 md:max-w-[640px]"
    >
      <motion.header variants={itemVariants} className="mb-6">
        <span className="nk-eyebrow">Compte</span>
        <h1 className="nk-h1 text-text-primary mt-1.5 tracking-[-0.02em]">Réglages</h1>
      </motion.header>

      {/* Notifications */}
      <Section title="Notifications" icon={Bell}>
        <Toggle
          label="Push · Rendez-vous"
          desc="Confirmation, rappel J-1, annulation"
          on={toggles.pushRdv}
          onClick={() => setToggle('pushRdv')}
        />
        <Toggle
          label="Push · Nouveaux matchs"
          desc="Quand de nouveaux pros correspondent à ton profil"
          on={toggles.pushMatch}
          onClick={() => setToggle('pushMatch')}
        />
        <Toggle
          label="Email · Rappel J-1"
          desc="Aussi par email pour ne rien manquer"
          on={toggles.emailRappel}
          onClick={() => setToggle('emailRappel')}
        />
        <Toggle
          label="Email · Newsletter"
          desc="Conseils de coachs, nouveautés produit"
          on={toggles.emailNewsletter}
          onClick={() => setToggle('emailNewsletter')}
        />
      </Section>

      {/* Langue */}
      <Section title="Langue & région" icon={Globe}>
        <LinkRow label="Langue" value="Français" />
        <LinkRow label="Fuseau horaire" value="Europe/Paris" />
        <LinkRow label="Devise" value="EUR (€)" />
      </Section>

      {/* Confidentialité */}
      <Section title="Confidentialité" icon={Lock}>
        <LinkRow label="Profil visible" value="Pros uniquement" />
        <LinkRow label="Partage des données santé" value="Aucun" />
        <LinkRow label="Supprimer mes vibes du matching" value="Désactivé" />
      </Section>

      {/* RGPD */}
      <Section title="Données personnelles (RGPD)" icon={Download}>
        <button
          type="button"
          className="bg-card border-border/40 hover:bg-surface-elevated flex w-full items-center gap-3 rounded-xl border p-4 transition-colors"
        >
          <span
            aria-hidden="true"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]"
            style={{ background: 'var(--color-accent-gold-wash)' }}
          >
            <Download size={15} className="text-accent-gold" />
          </span>
          <div className="min-w-0 flex-1 text-left">
            <p className="text-text-primary text-[14px] font-medium">
              Exporter mes données
            </p>
            <p className="text-text-tertiary text-[11.5px]">
              Profil, séances, messages — fichier JSON
            </p>
          </div>
          <ChevronRight size={16} className="text-text-tertiary" />
        </button>

        <button
          type="button"
          className="border-danger/30 bg-danger/5 hover:bg-danger/15 mt-2 flex w-full items-center gap-3 rounded-xl border p-4 transition-colors active:translate-y-px"
        >
          <span
            aria-hidden="true"
            className="bg-danger/15 flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]"
          >
            <Trash2 size={15} className="text-danger" />
          </span>
          <div className="min-w-0 flex-1 text-left">
            <p className="text-danger text-[14px] font-medium">Supprimer mon compte</p>
            <p className="text-text-tertiary text-[11.5px]">
              Définitif après 30 jours de conservation légale
            </p>
          </div>
        </button>
      </Section>

      <p className="text-text-tertiary mt-6 text-center text-[11px]">
        Nakama v0.1 · Conditions · Confidentialité · Mentions légales
      </p>
    </motion.div>
  );
}

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <motion.section variants={itemVariants} className="mb-6">
      <div className="mb-3 flex items-center gap-2 px-1">
        <Icon size={13} className="text-accent-muted" />
        <span className="nk-label text-accent-muted">{title}</span>
      </div>
      <div className="flex flex-col gap-2">{children}</div>
    </motion.section>
  );
}

function Toggle({
  label,
  desc,
  on,
  onClick,
}: {
  label: string;
  desc: string;
  on: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      role="switch"
      aria-checked={on}
      className="bg-card border-border/40 hover:bg-surface-elevated flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-colors"
    >
      <div className="min-w-0 flex-1">
        <p className="text-text-primary text-[13.5px] font-medium">{label}</p>
        <p className="text-text-tertiary mt-0.5 text-[11.5px]">{desc}</p>
      </div>
      <span
        aria-hidden="true"
        className={cn(
          'relative h-6 w-11 shrink-0 rounded-full transition-colors',
          on ? 'bg-primary' : 'bg-border/60',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all duration-200',
            on ? 'left-[22px]' : 'left-0.5',
          )}
        />
      </span>
    </button>
  );
}

function LinkRow({ label, value }: { label: string; value: string }) {
  return (
    <button
      type="button"
      className="bg-card border-border/40 hover:bg-surface-elevated flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-colors"
    >
      <div className="min-w-0 flex-1">
        <p className="text-text-primary text-[13.5px] font-medium">{label}</p>
      </div>
      <span className="text-text-secondary text-[12.5px]">{value}</span>
      <ChevronRight size={16} className="text-text-tertiary" />
    </button>
  );
}
