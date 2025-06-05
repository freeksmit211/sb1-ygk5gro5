import React, { useState, useEffect } from 'react';
import { MessageSquare, Calendar, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FrancoActivity } from '../types/francoActivity';
import { FrancoFeedback as FrancoFeedbackType } from '../types/francoFeedback';
import { getFeedbackWithActivities } from '../services/francoFeedbackService';
import FeedbackSearch from '../components/sales/FeedbackSearch';

interface FeedbackWithActivity extends FrancoFeedbackType {
  activity?: FrancoActivity;
}

const FrancoFeedbackPage: React.FC = () => {
  const navigate = useNavigate();
  const [feedbackList, setFeedbackList] = useState<FeedbackWithActivity[]>([]);
  const [filteredFeedback, setFilteredFeedback] = useState<FeedbackWithActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeedback();
  }, []);

  const loadFeedback = async () => {
    try {
      setLoading(true);
      const completeFeedbackList = await getFeedbackWithActivities();
      setFeedbackList(completeFeedbackList);
      setFilteredFeedback(completeFeedbackList);
    } catch (error) {
      console.error('Failed to load feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    const searchTerm = query.toLowerCase();
    filterFeedback(searchTerm);
  };

  const handleDateRangeChange = (startDate: string, endDate: string) => {
    if (!startDate && !endDate) {
      setFilteredFeedback(feedbackList);
      return;
    }

    const filtered = feedbackList.filter(feedback => {
      const feedbackDate = new Date(feedback.createdAt);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      if (start && end) {
        return feedbackDate >= start && feedbackDate <= new Date(end.setHours(23, 59, 59));
      } else if (start) {
        return feedbackDate >= start;
      } else if (end) {
        return feedbackDate <= new Date(end.setHours(23, 59, 59));
      }

      return true;
    });

    setFilteredFeedback(filtered);
  };

  const filterFeedback = (searchTerm: string) => {
    const filtered = feedbackList.filter(feedback => {
      const activity = feedback.activity;
      if (!activity) return false;

      return (
        activity.customerName.toLowerCase().includes(searchTerm) ||
        activity.company.toLowerCase().includes(searchTerm) ||
        feedback.note.toLowerCase().includes(searchTerm)
      );
    });
    setFilteredFeedback(filtered);
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
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="text-white hover:text-blue-100"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-white">Franco's Feedback History</h1>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="mb-6">
          <FeedbackSearch 
            onSearch={handleSearch} 
            onDateRangeChange={handleDateRangeChange}
            showDateRange={true}
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFeedback.map(feedback => (
              <div key={feedback.id} className="bg-gray-50 rounded-lg p-4">
                {feedback.activity ? (
                  <>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {feedback.activity.customerName}
                        </h3>
                        <p className="text-sm text-gray-600">{feedback.activity.company}</p>
                      </div>
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {feedback.activity.type}
                      </span>
                    </div>
                    <p className="text-gray-800 mb-3">{feedback.activity.description}</p>
                  </>
                ) : (
                  <p className="text-gray-500 italic mb-3">Activity details not available</p>
                )}
                
                <div className="bg-white rounded p-3">
                  <p className="text-gray-800">{feedback.note}</p>
                </div>
                
                <div className="mt-3 text-sm text-gray-500 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {formatDate(feedback.createdAt)}
                </div>
              </div>
            ))}
            
            {filteredFeedback.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                {feedbackList.length === 0 ? 'No feedback available yet' : 'No matching feedback found'}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FrancoFeedbackPage;