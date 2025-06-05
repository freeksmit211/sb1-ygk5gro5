import React, { useEffect, useRef, useState } from 'react';
import ChatHeader from './ChatHeader';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { ChatMessage as ChatMessageType } from '../../types/chat';
import { subscribeToMessages, sendMessage } from '../../services/chatService';

interface ChatWindowProps {
  chatId: string | null;
  recipientId: string;
  recipientName: string;
  currentUserId: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  chatId,
  recipientId,
  recipientName,
  currentUserId
}) => {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = subscribeToMessages(chatId, (updatedMessages) => {
      setMessages(updatedMessages);
    });

    return () => unsubscribe();
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!chatId) return;
    
    await sendMessage({
      chatId,
      senderId: currentUserId,
      content,
      read: false
    });
  };

  return (
    <div className="flex flex-col h-full">
      <ChatHeader recipientName={recipientName} />
      
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#efeae2]">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            isCurrentUser={message.senderId === currentUserId}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <ChatInput onSendMessage={handleSendMessage} disabled={!chatId} />
    </div>
  );
};

export default ChatWindow;