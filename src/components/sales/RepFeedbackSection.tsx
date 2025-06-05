import React, { useState, useEffect } from 'react';
import { MessageSquare, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import FeedbackSearch from './FeedbackSearch';
import { getFeedbackWithActivities } from '../../services/feedbackService';
import { SalesActivity } from '../../types/salesActivity';
import { SalesFeedback } from '../../types/salesFeedback';

interface FeedbackWithActivity extends SalesFeedback {
  activity?: SalesActivity;
}

interface RepFeedbackSectionProps {
  repId: string;
  repName: string;
  showLatestOnly?: boolean;
  viewAllPath?: string;
}

const RepFeedbackSection: React.FC<RepFeedbackSectionProps> = ({ 
  repId, 
  repName,
  showLatestOnly = false,
  viewAllPath
}) => {
  const [feedbackList, setFeedbackList] = useState<FeedbackWithActivity[]>([]);
  const [filteredFeedback, setFilteredFeedback] = useState<FeedbackWithActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFeedback();
  }, [repId]);

  const loadFeedback = async () => {
    try {
      setLoading(true);
      setError(null);
      const feedback = await getFeedbackWithActivities(repId);
      setFeedbackList(feedback);
      setFilteredFeedback(feedback);
    } catch (error) {
      console.error('Failed to load feedback:', error);
      setError('Failed to load feedback. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    const searchTerm = query.toLowerCase();
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

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <MessageSquare className="w-6 h-6" />
          {repName}'s Activity Feedback
        </h2>
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <MessageSquare className="w-6 h-6" />
          {repName}'s Activity Feedback
        </h2>
        <div className="text-center py-8 text-red-600">
          <p>{error}</p>
          <button
            onClick={loadFeedback}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Get feedback to display based on showLatestOnly prop
  const displayFeedback = showLatestOnly ? filteredFeedback.slice(0, 1) : filteredFeedback;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-6 h-6" />
          <h2 className="text-xl font-bold text-gray-900">
            {repName}'s {showLatestOnly ? 'Latest' : ''} Feedback
          </h2>
        </div>
        {showLatestOnly && viewAllPath && feedbackList.length > 0 && (
          <Link
            to={viewAllPath}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      {!showLatestOnly && (
        <div className="mb-6">
          <FeedbackSearch onSearch={handleSearch} />
        </div>
      )}
      
      <div className="space-y-4">
        {displayFeedback.map(feedback => (
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
        
        {displayFeedback.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {feedbackList.length === 0 ? 'No feedback available yet' : 'No matching feedback found'}
          </div>
        )}
      </div>
    </div>
  );
};

export default RepFeedbackSection;