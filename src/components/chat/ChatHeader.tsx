import React from 'react';
import { MoreVertical, Search, Phone, VideoIcon } from 'lucide-react';

interface ChatHeaderProps {
  recipientName: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ recipientName }) => {
  return (
    <div className="bg-[#f0f2f5] px-4 py-2 flex items-center justify-between border-l border-gray-200">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-300"></div>
        <div>
          <h3 className="font-medium text-gray-900">{recipientName}</h3>
          <p className="text-xs text-gray-500">online</p>
        </div>
      </div>
      <div className="flex items-center gap-4 text-[#54656f]">
        <VideoIcon className="w-5 h-5 cursor-pointer hover:text-gray-600" />
        <Phone className="w-5 h-5 cursor-pointer hover:text-gray-600" />
        <Search className="w-5 h-5 cursor-pointer hover:text-gray-600" />
        <MoreVertical className="w-5 h-5 cursor-pointer hover:text-gray-600" />
      </div>
    </div>
  );
};

export default ChatHeader;