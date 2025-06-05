import React from 'react';
import { AlertTriangle, Clock } from 'lucide-react';
import { Notice } from '../../types/notice';

interface NoticeListProps {
  notices: Notice[];
}

const NoticeList: React.FC<NoticeListProps> = ({ notices }) => {
  const getPriorityColor = (priority: Notice['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-4">
      {notices.map(notice => (
        <div key={notice.id} className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{notice.title}</h3>
              <p className="text-sm text-gray-500">Posted on {formatDate(notice.createdAt)}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(notice.priority)}`}>
              {notice.priority}
            </span>
          </div>
          
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap">{notice.content}</p>
          </div>

          {notice.expiresAt && (
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>Expires on {formatDate(notice.expiresAt)}</span>
            </div>
          )}
        </div>
      ))}

      {notices.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No active notices at the moment</p>
        </div>
      )}
    </div>
  );
};

export default NoticeList;