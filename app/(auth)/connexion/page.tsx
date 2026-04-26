'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/stores/user-store';
import { useModeStore } from '@/stores/mode-store';
import { defaultSportif } from '@/lib/mock-data';
import { pros } from '@/lib/mock-data';

type Tab = 'connexion' | 'inscription';

export default function ConnexionPage() {
  const router = useRouter();
  const setSportif = useUserStore((s) => s.setSportif);
  const setPro = useUserStore((s) => s.setPro);
  const setMode = useModeStore((s) => s.setMode);

  const [tab, setTab] = useState<Tab>('connexion');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'sportif' | 'pro'>('sportif');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) return;

    if (role === 'sportif') {
      setSportif(defaultSportif);
      setMode('sportif');
      router.push('/accueil');
    } else {
      const demoPro = pros[4]!; // Julie Martin — le pro mock de démo
      setPro(demoPro);
      setMode('pro');
      router.push('/dashboard');
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="w-full max-w-md px-4"
    >
      {/* Logo */}
      <div className="mb-10 text-center">
        <span className="text-accent-gold text-4xl font-bold">NAKAMA</span>
      </div>

      {/* Onglets */}
      <div className="border-border bg-surface mb-8 flex overflow-hidden rounded-lg border">
        {(['connexion', 'inscription'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'flex-1 py-3 text-sm font-medium capitalize transition-colors',
              tab === t
                ? 'bg-accent-gold text-background'
                : 'text-text-secondary hover:text-text-primary',
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <h1 className="text-accent-gold mb-2 text-center text-xl font-bold">
        {tab === 'connexion' ? 'Bienvenue sur Nakama' : 'Rejoins Nakama'}
      </h1>
      <p className="text-text-secondary mb-8 text-center text-sm">
        {tab === 'connexion'
          ? 'Connecte-toi pour retrouver tes matchs'
          : 'Crée ton compte en quelques secondes'}
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Email */}
        <div className="relative">
          <Mail
            size={18}
            className="text-text-tertiary absolute top-1/2 left-3 -translate-y-1/2"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border-border bg-surface text-text-primary placeholder:text-text-tertiary focus:border-accent-gold focus:ring-accent-gold/30 h-12 w-full rounded-[10px] border pr-4 pl-10 text-sm focus:ring-2 focus:outline-none"
          />
        </div>

        {/* Mot de passe */}
        <div className="relative">
          <Lock
            size={18}
            className="text-text-tertiary absolute top-1/2 left-3 -translate-y-1/2"
          />
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={4}
            className="border-border bg-surface text-text-primary placeholder:text-text-tertiary focus:border-accent-gold focus:ring-accent-gold/30 h-12 w-full rounded-[10px] border pr-10 pl-10 text-sm focus:ring-2 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="text-text-tertiary hover:text-text-secondary absolute top-1/2 right-3 -translate-y-1/2"
            aria-label={
              showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'
            }
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Sélection rôle */}
        <div>
          <p className="text-text-secondary mb-2 text-xs font-medium">Je suis :</p>
          <div className="flex gap-3">
            {(['sportif', 'pro'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={cn(
                  'flex-1 rounded-[10px] border py-2.5 text-sm font-medium capitalize transition-all',
                  role === r
                    ? 'border-accent-gold bg-accent-gold/10 text-accent-gold'
                    : 'border-border text-text-secondary hover:border-text-tertiary',
                )}
              >
                {r === 'pro' ? 'Professionnel' : 'Sportif'}
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <Button type="submit" size="lg" className="mt-2 h-12 w-full text-base">
          {tab === 'connexion' ? 'Se connecter' : "S'inscrire"}
        </Button>
      </form>

      <p className="text-text-tertiary mt-6 text-center text-xs">
        {tab === 'connexion' ? (
          <>
            Pas encore de compte ?{' '}
            <button
              onClick={() => setTab('inscription')}
              className="text-accent-gold hover:underline"
            >
              Inscris-toi
            </button>
          </>
        ) : (
          <>
            Déjà un compte ?{' '}
            <button
              onClick={() => setTab('connexion')}
              className="text-accent-gold hover:underline"
            >
              Connecte-toi
            </button>
          </>
        )}
      </p>
    </motion.div>
  );
}
