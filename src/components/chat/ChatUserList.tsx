import React from 'react';
import { User } from 'lucide-react';
import { ChatUser } from '../../types/chat';

interface ChatUserListProps {
  users: ChatUser[];
  onSelectUser: (user: ChatUser) => void;
  selectedUserId?: string;
}

const ChatUserList: React.FC<ChatUserListProps> = ({
  users,
  onSelectUser,
  selectedUserId
}) => {
  return (
    <div className="divide-y divide-gray-200">
      {users.map((user) => (
        <button
          key={user.id}
          onClick={() => onSelectUser(user)}
          className={`w-full px-4 py-3 hover:bg-gray-50 text-left transition-colors ${
            user.id === selectedUserId ? 'bg-blue-50' : ''
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 rounded-full p-2">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">{user.name}</h4>
              <p className="text-sm text-gray-500">{user.role}</p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default ChatUserList;