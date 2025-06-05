import React from 'react';
import { ChatUser } from '../../types/chat';
import { Check } from 'lucide-react';

interface ChatListProps {
  users: ChatUser[];
  onSelectUser: (user: ChatUser) => void;
  selectedUserId?: string;
}

const ChatList: React.FC<ChatListProps> = ({ users, onSelectUser, selectedUserId }) => {
  const formatTime = () => {
    return new Date().toLocaleTimeString('en-ZA', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="divide-y divide-gray-100">
      {users.map((user) => (
        <div
          key={user.id}
          onClick={() => onSelectUser(user)}
          className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-[#f0f2f5] transition-colors ${
            user.id === selectedUserId ? 'bg-[#f0f2f5]' : ''
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-gray-300 flex-shrink-0"></div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <h4 className="font-medium text-gray-900 truncate">{user.name}</h4>
              <span className="text-xs text-gray-500">{formatTime()}</span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <Check className="w-4 h-4 text-[#53bdeb]" />
              <span className="text-gray-600 truncate">Click to start chatting</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatList;