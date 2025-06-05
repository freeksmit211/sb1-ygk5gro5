import React, { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import WhatsAppLayout from '../components/chat/WhatsAppLayout';
import { ChatUser } from '../types/chat';
import { createOrGetChat } from '../services/chatService';
import { useAuth } from '../contexts/AuthContext';

const Chat: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [chatId, setChatId] = useState<string | null>(null);
  const [users, setUsers] = useState<ChatUser[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    // Simulated user list - replace with actual user fetching
    setUsers([
      { id: 'franco', name: 'Franco', role: 'Sales Rep', online: true, lastSeen: new Date().toISOString() },
      { id: 'freek', name: 'Freek', role: 'Sales Rep', online: true, lastSeen: new Date().toISOString() },
      { id: 'jeckie', name: 'Jeckie', role: 'Sales Rep', online: true, lastSeen: new Date().toISOString() }
    ]);
  }, []);

  const handleSelectUser = async (selectedUser: ChatUser) => {
    setSelectedUser(selectedUser);
    if (user) {
      const newChatId = await createOrGetChat([user.id, selectedUser.id]);
      setChatId(newChatId);
    }
  };

  if (!user) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Please sign in to use the chat</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <MessageSquare className="w-8 h-8" />
        Company Chat
      </h1>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <WhatsAppLayout
          selectedUser={selectedUser}
          chatId={chatId}
          currentUserId={user.id}
          users={users}
          onSelectUser={handleSelectUser}
        />
      </div>
    </div>
  );
};

export default Chat;