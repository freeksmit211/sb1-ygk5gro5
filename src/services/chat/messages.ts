import { 
  collection, 
  addDoc,
  query, 
  where, 
  orderBy,
  serverTimestamp,
  doc,
  updateDoc
} from 'firebase/firestore';
import { db } from '../../lib/firebase/config';
import { ChatMessage } from '../../types/chat';

const MESSAGES_COLLECTION = 'chat_messages';
const CHATS_COLLECTION = 'chats';

export const sendMessage = async (message: Omit<ChatMessage, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const chatRef = doc(db, CHATS_COLLECTION, message.chatId);
    const messageRef = await addDoc(collection(db, MESSAGES_COLLECTION), {
      ...message,
      createdAt: serverTimestamp()
    });

    await updateDoc(chatRef, {
      lastMessage: {
        content: message.content,
        senderId: message.senderId,
        createdAt: serverTimestamp()
      },
      updatedAt: serverTimestamp()
    });

    return messageRef.id;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const getMessagesQuery = (chatId: string) => {
  return query(
    collection(db, MESSAGES_COLLECTION),
    where('chatId', '==', chatId),
    orderBy('createdAt', 'asc')
  );
};