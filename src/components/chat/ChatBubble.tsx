import React from 'react';
import { Check } from 'lucide-react';

interface ChatBubbleProps {
  content: string;
  timestamp: string;
  isCurrentUser: boolean;
  isRead?: boolean;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({
  content,
  timestamp,
  isCurrentUser,
  isRead = false
}) => {
  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[65%] rounded-lg px-3 py-2 ${
          isCurrentUser
            ? 'bg-[#d9fdd3] text-gray-800'
            : 'bg-white text-gray-800'
        }`}
      >
        <p className="break-words text-sm">{content}</p>
        <div className="flex items-center justify-end gap-1 mt-1">
          <span className="text-[11px] text-gray-500">{timestamp}</span>
          {isCurrentUser && (
            <div className="flex">
              <Check className="w-3.5 h-3.5 text-[#53bdeb]" />
              {isRead && <Check className="w-3.5 h-3.5 text-[#53bdeb] -ml-[5px]" />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;