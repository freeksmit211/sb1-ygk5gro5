import { supabase } from '../lib/supabase';
import { ChatMessage, Chat } from '../types/chat';

export const createOrGetChat = async (participants: string[]): Promise<string> => {
  try {
    const sortedParticipants = [...participants].sort();
    
    const { data: existingChat, error: queryError } = await supabase
      .from('chats')
      .select('id')
      .contains('participants', sortedParticipants)
      .single();

    if (queryError && queryError.code !== 'PGRST116') throw queryError;
    
    if (existingChat) {
      return existingChat.id;
    }

    const { data: newChat, error: insertError } = await supabase
      .from('chats')
      .insert({
        participants: sortedParticipants,
      })
      .select()
      .single();

    if (insertError) throw insertError;
    return newChat.id;
  } catch (error) {
    console.error('Error creating/getting chat:', error);
    throw error;
  }
};

export const sendMessage = async (message: Omit<ChatMessage, 'id' | 'createdAt'>): Promise<string> => {
  try {
    if (!message.chatId) {
      throw new Error('Chat ID is required');
    }

    const { data: messageData, error: messageError } = await supabase
      .from('chat_messages')
      .insert({
        chat_id: message.chatId,
        sender_id: message.senderId,
        content: message.content,
        read: message.read
      })
      .select()
      .single();

    if (messageError) throw messageError;

    const { error: chatError } = await supabase
      .from('chats')
      .update({
        last_message: {
          content: message.content,
          sender_id: message.senderId,
          created_at: new Date().toISOString()
        },
        updated_at: new Date().toISOString()
      })
      .eq('id', message.chatId);

    if (chatError) throw chatError;

    return messageData.id;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const subscribeToMessages = (
  chatId: string | null,
  callback: (messages: ChatMessage[]) => void
): (() => void) => {
  if (!chatId) {
    callback([]);
    return () => {};
  }

  const subscription = supabase
    .channel(`chat:${chatId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'chat_messages',
        filter: `chat_id=eq.${chatId}`
      },
      async () => {
        // Fetch latest messages when changes occur
        const { data, error } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('chat_id', chatId)
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Error fetching messages:', error);
          return;
        }

        callback(data as ChatMessage[]);
      }
    )
    .subscribe();

  // Initial fetch
  supabase
    .from('chat_messages')
    .select('*')
    .eq('chat_id', chatId)
    .order('created_at', { ascending: true })
    .then(({ data, error }) => {
      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }
      callback(data as ChatMessage[]);
    });

  return () => {
    subscription.unsubscribe();
  };
};

export const subscribeToUserChats = (
  userId: string | null,
  callback: (chats: Chat[]) => void
): (() => void) => {
  if (!userId) {
    callback([]);
    return () => {};
  }

  const subscription = supabase
    .channel(`user_chats:${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'chats',
        filter: `participants=cs.{${userId}}`
      },
      async () => {
        // Fetch latest chats when changes occur
        const { data, error } = await supabase
          .from('chats')
          .select('*')
          .contains('participants', [userId])
          .order('updated_at', { ascending: false });

        if (error) {
          console.error('Error fetching chats:', error);
          return;
        }

        callback(data as Chat[]);
      }
    )
    .subscribe();

  // Initial fetch
  supabase
    .from('chats')
    .select('*')
    .contains('participants', [userId])
    .order('updated_at', { ascending: false })
    .then(({ data, error }) => {
      if (error) {
        console.error('Error fetching chats:', error);
        return;
      }
      callback(data as Chat[]);
    });

  return () => {
    subscription.unsubscribe();
  };
};