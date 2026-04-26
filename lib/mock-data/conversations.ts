import type { Conversation } from '@/types';

export const conversations: Conversation[] = [
  {
    id: 'conv-001',
    participants: ['pro-001', 'sportif-001'],
    dernierMessage: '2026-04-18T14:30:00',
    nonLusPro: 0,
    nonLusSportif: 1,
    messages: [
      {
        id: 'msg-001',
        auteurId: 'sportif-001',
        contenu:
          'Bonjour Marine, je souhaite reprendre le sport après 2 ans sans activité. Vous êtes disponible samedi ?',
        date: '2026-04-16T10:00:00',
        lu: true,
      },
      {
        id: 'msg-002',
        auteurId: 'pro-001',
        contenu:
          'Bonjour Thomas ! Bien sûr, je suis disponible samedi à 10h ou 15h. Quelle heure vous arrange ?',
        date: '2026-04-16T11:30:00',
        lu: true,
      },
      {
        id: 'msg-003',
        auteurId: 'sportif-001',
        contenu: '15h ce serait parfait. On se retrouve où ?',
        date: '2026-04-16T12:15:00',
        lu: true,
      },
      {
        id: 'msg-004',
        auteurId: 'pro-001',
        contenu:
          "Je vous envoie la localisation de la salle. Pensez à apporter une serviette et une bouteille d'eau. À samedi !",
        date: '2026-04-16T13:00:00',
        lu: true,
      },
      {
        id: 'msg-005',
        auteurId: 'pro-001',
        contenu: "N'oubliez pas de bien vous hydrater avant demain 💪",
        date: '2026-04-18T14:30:00',
        lu: false,
      },
    ],
  },
  {
    id: 'conv-002',
    participants: ['pro-003', 'sportif-002'],
    dernierMessage: '2026-04-17T09:45:00',
    nonLusPro: 1,
    nonLusSportif: 0,
    messages: [
      {
        id: 'msg-006',
        auteurId: 'sportif-002',
        contenu:
          "Bonjour Léa, j'aimerais essayer le yoga mais je n'ai jamais pratiqué. C'est adapté pour les débutantes ?",
        date: '2026-04-15T18:00:00',
        lu: true,
      },
      {
        id: 'msg-007',
        auteurId: 'pro-003',
        contenu:
          'Absolument Chloé ! Le Vinyasa est très adaptable. On commence doucement et on progresse à votre rythme. Quand souhaitez-vous commencer ?',
        date: '2026-04-15T19:30:00',
        lu: true,
      },
      {
        id: 'msg-008',
        auteurId: 'sportif-002',
        contenu: 'Super ! Est-ce que mardi prochain en fin de matinée ça irait ?',
        date: '2026-04-17T09:45:00',
        lu: false,
      },
    ],
  },
  {
    id: 'conv-003',
    participants: ['pro-002', 'sportif-001'],
    dernierMessage: '2026-04-16T20:00:00',
    nonLusPro: 0,
    nonLusSportif: 0,
    messages: [
      {
        id: 'msg-009',
        auteurId: 'sportif-001',
        contenu:
          "Salut Youssef, j'ai adoré la séance CrossFit. J'ai des courbatures de fou mais c'était top !",
        date: '2026-04-15T19:00:00',
        lu: true,
      },
      {
        id: 'msg-010',
        auteurId: 'pro-002',
        contenu:
          "Content que ça t'ait plu ! Les courbatures c'est normal pour une première. Pense à bien t'étirer ce soir et demain matin.",
        date: '2026-04-15T20:30:00',
        lu: true,
      },
      {
        id: 'msg-011',
        auteurId: 'sportif-001',
        contenu: 'Ok je note. On refait quand ?',
        date: '2026-04-16T08:00:00',
        lu: true,
      },
      {
        id: 'msg-012',
        auteurId: 'pro-002',
        contenu:
          'Je te propose mardi 22 à 9h. Ça te va ? On travaillera le haut du corps cette fois.',
        date: '2026-04-16T20:00:00',
        lu: true,
      },
    ],
  },
  {
    id: 'conv-004',
    participants: ['pro-005', 'sportif-001'],
    dernierMessage: '2026-04-19T10:00:00',
    nonLusPro: 0,
    nonLusSportif: 1,
    messages: [
      {
        id: 'msg-013',
        auteurId: 'pro-005',
        contenu:
          "Thomas, j'ai analysé tes données de la semaine. Tu es à -3.6 kg depuis le début. Excellent rythme !",
        date: '2026-04-18T09:00:00',
        lu: true,
      },
      {
        id: 'msg-014',
        auteurId: 'sportif-001',
        contenu:
          "Trop bien ! Je sens la différence. Le programme nutrition m'aide beaucoup aussi.",
        date: '2026-04-18T12:30:00',
        lu: true,
      },
      {
        id: 'msg-015',
        auteurId: 'pro-005',
        contenu:
          "On se voit mercredi pour ajuster le plan. J'ai de nouvelles idées pour accélérer la perte tout en préservant la masse musculaire.",
        date: '2026-04-19T10:00:00',
        lu: false,
      },
    ],
  },
  {
    id: 'conv-005',
    participants: ['pro-004', 'sportif-007'],
    dernierMessage: '2026-04-17T15:00:00',
    nonLusPro: 0,
    nonLusSportif: 0,
    messages: [
      {
        id: 'msg-016',
        auteurId: 'sportif-007',
        contenu:
          "Salut Abdel, je voulais savoir si tu acceptais les débutants complets ? J'ai jamais mis de gants.",
        date: '2026-04-15T14:00:00',
        lu: true,
      },
      {
        id: 'msg-017',
        auteurId: 'pro-004',
        contenu:
          'Bien sûr Lucas ! 80% de mes clients débutent avec moi. On commence par les bases : position, jab, esquive. Tu vas adorer.',
        date: '2026-04-15T16:00:00',
        lu: true,
      },
      {
        id: 'msg-018',
        auteurId: 'sportif-007',
        contenu: 'Ça me rassure ! Je peux venir vendredi ?',
        date: '2026-04-16T10:00:00',
        lu: true,
      },
      {
        id: 'msg-019',
        auteurId: 'pro-004',
        contenu:
          "Vendredi 17h c'est parfait. Ramène juste des bandages et de l'eau. Les gants je te les prête pour la première séance.",
        date: '2026-04-17T15:00:00',
        lu: true,
      },
    ],
  },
  {
    id: 'conv-006',
    participants: ['pro-003', 'sportif-008'],
    dernierMessage: '2026-04-19T08:30:00',
    nonLusPro: 1,
    nonLusSportif: 0,
    messages: [
      {
        id: 'msg-020',
        auteurId: 'sportif-008',
        contenu:
          "Léa, merci pour la séance d'hier. Ma cheville ne me fait plus du tout mal pendant le yoga.",
        date: '2026-04-18T20:00:00',
        lu: true,
      },
      {
        id: 'msg-021',
        auteurId: 'pro-003',
        contenu:
          "Super nouvelle Sophie ! C'est le signe que la rééducation avance bien. On continue sur cette lancée.",
        date: '2026-04-19T07:00:00',
        lu: true,
      },
      {
        id: 'msg-022',
        auteurId: 'sportif-008',
        contenu:
          "Est-ce qu'on pourrait ajouter un peu de renforcement la prochaine fois ? Je me sens prête.",
        date: '2026-04-19T08:30:00',
        lu: false,
      },
    ],
  },
  {
    id: 'conv-007',
    participants: ['pro-002', 'sportif-003'],
    dernierMessage: '2026-04-18T07:00:00',
    nonLusPro: 0,
    nonLusSportif: 0,
    messages: [
      {
        id: 'msg-023',
        auteurId: 'pro-002',
        contenu:
          'Mehdi, les qualifs régionales sont dans 6 semaines. On ajuste le programme cette semaine. RDV mardi 9h.',
        date: '2026-04-17T21:00:00',
        lu: true,
      },
      {
        id: 'msg-024',
        auteurId: 'sportif-003',
        contenu: 'Reçu coach. Je suis chaud. On envoie du lourd.',
        date: '2026-04-18T07:00:00',
        lu: true,
      },
    ],
  },
  {
    id: 'conv-008',
    participants: ['pro-005', 'sportif-006'],
    dernierMessage: '2026-04-17T19:00:00',
    nonLusPro: 0,
    nonLusSportif: 0,
    messages: [
      {
        id: 'msg-025',
        auteurId: 'sportif-006',
        contenu:
          "Julie, j'ai regardé les macros que tu m'as envoyées. C'est faisable mais les protéines c'est beaucoup non ?",
        date: '2026-04-17T12:00:00',
        lu: true,
      },
      {
        id: 'msg-026',
        auteurId: 'pro-005',
        contenu:
          "C'est normal pour ta phase de prise. 1.8g/kg c'est le minimum pour ta prépa. Essaie pendant 2 semaines, on ajustera si besoin.",
        date: '2026-04-17T19:00:00',
        lu: true,
      },
    ],
  },
  {
    id: 'conv-009',
    participants: ['pro-001', 'sportif-005'],
    dernierMessage: '2026-04-16T11:00:00',
    nonLusPro: 0,
    nonLusSportif: 0,
    messages: [
      {
        id: 'msg-027',
        auteurId: 'sportif-005',
        contenu:
          "Marine, merci pour la séance adaptée. C'est la première fois que je fais du sport sans douleur au dos.",
        date: '2026-04-15T10:00:00',
        lu: true,
      },
      {
        id: 'msg-028',
        auteurId: 'pro-001',
        contenu:
          'Ça fait plaisir Antoine ! Avec votre hernie, il faut vraiment adapter chaque mouvement. On continue comme ça.',
        date: '2026-04-16T11:00:00',
        lu: true,
      },
    ],
  },
  {
    id: 'conv-010',
    participants: ['pro-002', 'sportif-009'],
    dernierMessage: '2026-04-19T06:30:00',
    nonLusPro: 0,
    nonLusSportif: 1,
    messages: [
      {
        id: 'msg-029',
        auteurId: 'sportif-009',
        contenu:
          "Youssef, j'ai fait mon fractionné solo ce matin. 8×400m en 1:18 de moyenne. C'est bon ?",
        date: '2026-04-18T17:00:00',
        lu: true,
      },
      {
        id: 'msg-030',
        auteurId: 'pro-002',
        contenu:
          "C'est excellent Karim ! Pile dans la zone sub-3h. Dimanche on fait une sortie longue 25 km. Réserve tes jambes.",
        date: '2026-04-19T06:30:00',
        lu: false,
      },
    ],
  },
  {
    id: 'conv-011',
    participants: ['pro-001', 'sportif-018'],
    dernierMessage: '2026-04-15T20:00:00',
    nonLusPro: 0,
    nonLusSportif: 0,
    messages: [
      {
        id: 'msg-031',
        auteurId: 'sportif-018',
        contenu:
          "Bonjour Marine, j'ai fait ma première séance hier et j'ai tout mal partout ! C'est normal ?",
        date: '2026-04-15T08:00:00',
        lu: true,
      },
      {
        id: 'msg-032',
        auteurId: 'pro-001',
        contenu:
          "Tout à fait normal Julie ! Ce sont les courbatures des premiers jours. Elles vont diminuer rapidement. Bois beaucoup d'eau et étire-toi ce soir.",
        date: '2026-04-15T20:00:00',
        lu: true,
      },
    ],
  },
  {
    id: 'conv-012',
    participants: ['pro-004', 'sportif-020'],
    dernierMessage: '2026-04-17T18:00:00',
    nonLusPro: 1,
    nonLusSportif: 0,
    messages: [
      {
        id: 'msg-033',
        auteurId: 'sportif-020',
        contenu:
          "Abdel, c'était incroyable hier ! Je pensais pas aimer autant la boxe. J'ai le sourire depuis.",
        date: '2026-04-17T08:00:00',
        lu: true,
      },
      {
        id: 'msg-034',
        auteurId: 'pro-004',
        contenu:
          "Haha content ! T'as un vrai potentiel Nadia. La semaine prochaine on attaque les combos.",
        date: '2026-04-17T12:00:00',
        lu: true,
      },
      {
        id: 'msg-035',
        auteurId: 'sportif-020',
        contenu:
          "J'ai hâte ! Est-ce que tu conseilles des gants en particulier à acheter ?",
        date: '2026-04-17T18:00:00',
        lu: false,
      },
    ],
  },
  {
    id: 'conv-013',
    participants: ['pro-005', 'sportif-015'],
    dernierMessage: '2026-04-18T06:00:00',
    nonLusPro: 0,
    nonLusSportif: 0,
    messages: [
      {
        id: 'msg-036',
        auteurId: 'pro-005',
        contenu:
          'Hugo, le programme de cette semaine est prêt. On passe en phase de force maximale. 3 séances cette semaine minimum.',
        date: '2026-04-17T20:00:00',
        lu: true,
      },
      {
        id: 'msg-037',
        auteurId: 'sportif-015',
        contenu: 'Reçu. Lundi, mercredi, vendredi. Pas de repos pour les guerriers.',
        date: '2026-04-18T06:00:00',
        lu: true,
      },
    ],
  },
  {
    id: 'conv-014',
    participants: ['pro-003', 'sportif-016'],
    dernierMessage: '2026-04-18T21:00:00',
    nonLusPro: 0,
    nonLusSportif: 0,
    messages: [
      {
        id: 'msg-038',
        auteurId: 'sportif-016',
        contenu:
          "Léa, j'ai essayé la méditation que tu m'as recommandée. C'est bluffant, je me suis endormie en 5 minutes.",
        date: '2026-04-18T21:00:00',
        lu: true,
      },
    ],
  },
  {
    id: 'conv-015',
    participants: ['pro-001', 'sportif-010'],
    dernierMessage: '2026-04-19T14:00:00',
    nonLusPro: 1,
    nonLusSportif: 0,
    messages: [
      {
        id: 'msg-039',
        auteurId: 'sportif-010',
        contenu:
          "Bonjour Marine, je suis Emma. J'aimerais commencer un programme de remise en forme. C'est possible d'avoir un cours d'essai ?",
        date: '2026-04-19T11:00:00',
        lu: true,
      },
      {
        id: 'msg-040',
        auteurId: 'pro-001',
        contenu:
          'Bonjour Emma ! Absolument. Je propose une séance découverte de 45 min. Quand es-tu disponible cette semaine ?',
        date: '2026-04-19T12:30:00',
        lu: true,
      },
      {
        id: 'msg-041',
        auteurId: 'sportif-010',
        contenu: 'Mercredi 28 à 14h ça irait ?',
        date: '2026-04-19T14:00:00',
        lu: false,
      },
    ],
  },
];
