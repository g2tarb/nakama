'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Bell,
  Check,
  ChevronRight,
  CreditCard,
  Eye,
  HelpCircle,
  LogOut,
  Shield,
  User,
  type LucideIcon,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useUserStore } from '@/stores/user-store';
import { useModeStore } from '@/stores/mode-store';
import { pros } from '@/lib/mock-data';
import { FORMULES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { Formule } from '@/types';

type MenuKey = 'profil' | 'formule' | 'paiement' | 'notifs' | 'privacy' | 'help';

const MENU_ITEMS: {
  key: MenuKey;
  icon: LucideIcon;
  label: string;
  description: string;
}[] = [
  {
    key: 'profil',
    icon: Eye,
    label: 'Mon profil public',
    description: 'Aperçu de ce que voient les sportifs',
  },
  {
    key: 'formule',
    icon: CreditCard,
    label: 'Ma formule',
    description: 'Gérer mon abonnement',
  },
  {
    key: 'paiement',
    icon: User,
    label: 'Moyens de paiement',
    description: 'Carte bancaire et relevés',
  },
  {
    key: 'notifs',
    icon: Bell,
    label: 'Notifications',
    description: 'Emails, push et rappels',
  },
  {
    key: 'privacy',
    icon: Shield,
    label: 'Confidentialité et données',
    description: 'Gestion de vos données',
  },
  {
    key: 'help',
    icon: HelpCircle,
    label: 'Aide et support',
    description: 'FAQ et contact',
  },
];

const COMING_SOON_LABELS: Record<Exclude<MenuKey, 'formule'>, string> = {
  profil: 'Édition du profil public',
  paiement: 'Gestion des moyens de paiement',
  notifs: 'Préférences de notifications',
  privacy: 'Confidentialité et export RGPD',
  help: 'Centre d&apos;aide',
};

export default function ParametresPage() {
  const router = useRouter();
  const proFromStore = useUserStore((s) => s.pro);
  const clearUser = useUserStore((s) => s.clearUser);
  const setMode = useModeStore((s) => s.setMode);
  const pro = proFromStore ?? pros[4]!;

  const [openMenu, setOpenMenu] = useState<MenuKey | null>(null);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [selectedFormule, setSelectedFormule] = useState<Formule>(pro.formule);

  function handleLogout() {
    clearUser();
    setMode('public');
    router.push('/');
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 lg:px-8">
      <h1 className="text-accent-gold mb-6 text-xl font-bold">Paramètres</h1>

      <div className="space-y-2">
        {MENU_ITEMS.map(({ key, icon: Icon, label, description }) => (
          <button
            key={key}
            onClick={() => setOpenMenu(key)}
            className="border-border bg-surface hover:bg-surface-elevated flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-colors"
          >
            <Icon size={20} className="text-text-secondary shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium">{label}</p>
                {key === 'formule' && (
                  <Badge className="bg-accent-gold/10 text-accent-gold text-xs capitalize">
                    {pro.formule}
                  </Badge>
                )}
              </div>
              <p className="text-text-tertiary text-xs">{description}</p>
            </div>
            <ChevronRight size={16} className="text-text-tertiary" />
          </button>
        ))}

        <button
          onClick={() => setLogoutOpen(true)}
          className="border-danger/20 bg-danger/5 hover:bg-danger/10 flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-colors"
        >
          <LogOut size={20} className="text-danger" />
          <span className="text-danger font-medium">Déconnexion</span>
        </button>
      </div>

      {/* Dialog Formule */}
      <Dialog open={openMenu === 'formule'} onOpenChange={(o) => !o && setOpenMenu(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Choisis ta formule</DialogTitle>
            <DialogDescription>
              Tu es actuellement sur la formule{' '}
              <strong className="capitalize">{pro.formule}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            {FORMULES.map((f) => {
              const isCurrent = f.value === pro.formule;
              const isSelected = f.value === selectedFormule;
              return (
                <button
                  key={f.value}
                  onClick={() => setSelectedFormule(f.value)}
                  className={cn(
                    'flex flex-col gap-2 rounded-xl border p-4 text-left transition-all',
                    isSelected
                      ? 'border-accent-gold bg-accent-gold/5'
                      : 'border-border bg-surface hover:border-text-tertiary',
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <p className="text-base font-semibold capitalize">{f.label}</p>
                      {isCurrent && (
                        <Badge className="bg-success/10 text-success text-xs">
                          Active
                        </Badge>
                      )}
                    </div>
                    <p className="text-accent-gold text-lg font-bold">
                      {f.prix}€<span className="text-text-tertiary text-xs">/mois</span>
                    </p>
                  </div>
                  <ul className="text-text-secondary space-y-1 text-xs">
                    {f.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2">
                        <Check size={12} className="text-accent-gold mt-0.5 shrink-0" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                </button>
              );
            })}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenMenu(null)}>
              Annuler
            </Button>
            <Button
              disabled={selectedFormule === pro.formule}
              onClick={() => {
                alert(
                  `Demande de passage en formule ${selectedFormule} enregistrée. Notre équipe te contacte sous 24h.`,
                );
                setOpenMenu(null);
              }}
            >
              {selectedFormule === pro.formule ? 'Aucun changement' : 'Confirmer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Coming Soon (5 autres menus) */}
      {(['profil', 'paiement', 'notifs', 'privacy', 'help'] as const).map((k) => (
        <Dialog
          key={k}
          open={openMenu === k}
          onOpenChange={(o) => !o && setOpenMenu(null)}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Bientôt disponible</DialogTitle>
              <DialogDescription>
                {COMING_SOON_LABELS[k]} sera disponible dans la prochaine version. Si tu
                as un besoin urgent, écris-nous via le support.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={() => setOpenMenu(null)}>D&apos;accord</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ))}

      {/* Dialog Déconnexion */}
      <Dialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Se déconnecter ?</DialogTitle>
            <DialogDescription>
              Tu seras redirigé vers la page d&apos;accueil. Tes données restent en
              sécurité, tu peux te reconnecter à tout moment.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLogoutOpen(false)}>
              Rester connecté
            </Button>
            <Button
              onClick={handleLogout}
              className="bg-danger hover:bg-danger/90 text-white"
            >
              Me déconnecter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
