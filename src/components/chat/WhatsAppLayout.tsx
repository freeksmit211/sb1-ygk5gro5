import React from 'react';
import { Menu, Search, MoreVertical } from 'lucide-react';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import { ChatUser } from '../../types/chat';

interface WhatsAppLayoutProps {
  selectedUser: ChatUser | null;
  chatId: string | null;
  currentUserId: string;
  users: ChatUser[];
  onSelectUser: (user: ChatUser) => void;
}

const WhatsAppLayout: React.FC<WhatsAppLayoutProps> = ({
  selectedUser,
  chatId,
  currentUserId,
  users,
  onSelectUser
}) => {
  return (
    <div className="flex h-[calc(100vh-12rem)] bg-[#f0f2f5]">
      {/* Left sidebar */}
      <div className="w-[30%] min-w-[300px] bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="px-4 py-3 bg-[#f0f2f5] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-300"></div>
            <span className="font-medium">Simotech CRM</span>
          </div>
          <div className="flex items-center gap-4 text-gray-600">
            <Menu className="w-5 h-5 cursor-pointer" />
            <MoreVertical className="w-5 h-5 cursor-pointer" />
          </div>
        </div>

        {/* Search */}
        <div className="px-4 py-2 bg-white">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search or start new chat"
              className="w-full pl-10 pr-4 py-2 bg-[#f0f2f5] rounded-lg text-sm focus:outline-none"
            />
          </div>
        </div>

        {/* Chat list */}
        <div className="flex-1 overflow-y-auto">
          <ChatList
            users={users}
            onSelectUser={onSelectUser}
            selectedUserId={selectedUser?.id}
          />
        </div>
      </div>

      {/* Right chat window */}
      <div className="flex-1 bg-[#efeae2]">
        {selectedUser && chatId ? (
          <ChatWindow
            chatId={chatId}
            recipientId={selectedUser.id}
            recipientName={selectedUser.name}
            currentUserId={currentUserId}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            <div className="text-center">
              <p className="text-lg font-medium mb-2">Welcome to Simotech Chat</p>
              <p className="text-sm">Select a user to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhatsAppLayout;