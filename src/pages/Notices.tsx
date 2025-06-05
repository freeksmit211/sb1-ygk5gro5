import React, { useState, useEffect } from 'react';
import { Plus, Bell } from 'lucide-react';
import NoticeSections from '../components/notices/NoticeSections';
import NewNoticeModal from '../components/notices/NewNoticeModal';
import { getNotices } from '../services/noticeService';
import { Notice } from '../types/notice';

const Notices: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadNotices = async () => {
    try {
      setLoading(true);
      const data = await getNotices();
      setNotices(data);
    } catch (error) {
      console.error('Failed to load notices:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotices();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Bell className="w-8 h-8" />
          Company Notice Board
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          Add Notice
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <NoticeSections notices={notices} />
      )}

      <NewNoticeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onNoticeAdded={loadNotices}
      />
    </div>
  );
};

export default Notices;