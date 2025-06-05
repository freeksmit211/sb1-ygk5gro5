import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy,
  getDocs,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../../lib/firebase/config';
import { Chat } from '../../types/chat';

const CHATS_COLLECTION = 'chats';

export const createOrGetChat = async (participants: string[]): Promise<string> => {
  try {
    const sortedParticipants = [...participants].sort();
    
    const q = query(
      collection(db, CHATS_COLLECTION),
      where('participants', '==', sortedParticipants)
    );
    
    const existingChat = await getDocs(q);
    if (!existingChat.empty) {
      return existingChat.docs[0].id;
    }

    const chatRef = await addDoc(collection(db, CHATS_COLLECTION), {
      participants: sortedParticipants,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return chatRef.id;
  } catch (error) {
    console.error('Error creating/getting chat:', error);
    throw error;
  }
};

export const getUserChatsQuery = (userId: string) => {
  return query(
    collection(db, CHATS_COLLECTION),
    where('participants', 'array-contains', userId),
    orderBy('updatedAt', 'desc')
  );
};