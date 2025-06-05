import React from 'react';
import { Notice } from '../../types/notice';
import { Bell } from 'lucide-react';

interface NoticeSectionsProps {
  notices: Notice[];
}

const NoticeSections: React.FC<NoticeSectionsProps> = ({ notices }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (notices.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No notices posted yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {notices.map(notice => (
        <div key={notice.id} className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-semibold text-gray-900">{notice.title}</h3>
            <span className="text-sm text-gray-500">
              Posted {formatDate(notice.createdAt)}
            </span>
          </div>
          
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap">{notice.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NoticeSections;