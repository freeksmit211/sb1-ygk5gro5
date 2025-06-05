export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  createdAt: string;
  read: boolean;
}

export interface Chat {
  id: string;
  participants: string[];
  lastMessage?: {
    content: string;
    senderId: string;
    createdAt: string;
  };
  updatedAt: string;
}

export interface ChatUser {
  id: string;
  name: string;
  email: string;
  role: string;
  online: boolean;
  lastSeen: string;
}