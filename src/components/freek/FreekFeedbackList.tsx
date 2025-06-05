import React, { useState, useEffect } from 'react';
import { MessageSquare, Calendar } from 'lucide-react';
import { FreekActivity } from '../../types/freekActivity';
import { FreekFeedback } from '../../types/freekFeedback';
import { getFeedbackWithActivities } from '../../services/freekFeedbackService';

interface FeedbackWithActivity extends FreekFeedback {
  activity?: FreekActivity;
}

const FreekFeedbackList: React.FC = () => {
  const [feedbackList, setFeedbackList] = useState<FeedbackWithActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeedback();
  }, []);

  const loadFeedback = async () => {
    try {
      setLoading(true);
      const completeFeedbackList = await getFeedbackWithActivities();
      setFeedbackList(completeFeedbackList);
    } catch (error) {
      console.error('Failed to load feedback:', error);
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <MessageSquare className="w-6 h-6" />
        Activity Feedback History
      </h2>
      
      <div className="space-y-4">
        {feedbackList.map(feedback => (
          <div key={feedback.id} className="bg-white rounded-lg shadow-md p-4">
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
            
            <div className="bg-gray-50 rounded p-3">
              <p className="text-gray-800">{feedback.note}</p>
            </div>
            
            <div className="mt-3 text-sm text-gray-500 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {formatDate(feedback.createdAt)}
            </div>
          </div>
        ))}
        
        {feedbackList.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No feedback available yet
          </div>
        )}
      </div>
    </div>
  );
};

export default FreekFeedbackList;