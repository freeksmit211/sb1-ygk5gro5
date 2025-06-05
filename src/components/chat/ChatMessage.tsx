import React from 'react';
import { ChatMessage as ChatMessageType } from '../../types/chat';
import ChatBubble from './ChatBubble';

interface ChatMessageProps {
  message: ChatMessageType;
  isCurrentUser: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isCurrentUser }) => {
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-ZA', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <ChatBubble
      content={message.content}
      timestamp={formatTime(message.createdAt)}
      isCurrentUser={isCurrentUser}
      isRead={message.read}
    />
  );
};

export default ChatMessage;