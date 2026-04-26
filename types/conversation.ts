export interface Message {
  id: string;
  auteurId: string;
  contenu: string;
  date: string;
  lu: boolean;
}

export interface Conversation {
  id: string;
  participants: [string, string];
  messages: Message[];
  dernierMessage: string;
  nonLusPro: number;
  nonLusSportif: number;
}
