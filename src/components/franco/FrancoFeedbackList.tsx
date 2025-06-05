import React, { useState, useEffect } from 'react';
import { MessageSquare, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FrancoActivity } from '../../types/francoActivity';
import { FrancoFeedback } from '../../types/francoFeedback';
import { getFeedbackWithActivities } from '../../services/francoFeedbackService';

interface FeedbackWithActivity extends FrancoFeedback {
  activity?: FrancoActivity;
}

const FrancoFeedbackList: React.FC = () => {
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

  // Get only the most recent feedback
  const latestFeedback = feedbackList[0];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">Latest Feedback</h2>
        </div>
        {feedbackList.length > 0 && (
          <Link
            to="/feedback/franco"
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>
      
      <div className="space-y-4">
        {latestFeedback ? (
          <div className="bg-white rounded-lg shadow-md p-4">
            {latestFeedback.activity ? (
              <>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {latestFeedback.activity.customerName}
                    </h3>
                    <p className="text-sm text-gray-600">{latestFeedback.activity.company}</p>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                    {latestFeedback.activity.type}
                  </span>
                </div>
                <p className="text-gray-800 mb-3">{latestFeedback.activity.description}</p>
              </>
            ) : (
              <p className="text-gray-500 italic mb-3">Activity details not available</p>
            )}
            
            <div className="bg-gray-50 rounded p-3">
              <p className="text-gray-800">{latestFeedback.note}</p>
            </div>
            
            <div className="mt-3 text-sm text-gray-500 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {formatDate(latestFeedback.createdAt)}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No feedback available yet
          </div>
        )}
      </div>
    </div>
  );
};

export default FrancoFeedbackList;