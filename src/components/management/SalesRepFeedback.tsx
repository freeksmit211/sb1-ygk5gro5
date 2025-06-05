import React, { useState, useEffect } from 'react';
import { MessageSquare, Calendar } from 'lucide-react';
import FeedbackSearch from '../sales/FeedbackSearch';
import { getFeedbackWithActivities } from '../../services/feedbackService';
import { SalesActivity } from '../../types/salesActivity';
import { SalesFeedback } from '../../types/salesFeedback';

interface FeedbackWithActivity extends SalesFeedback {
  activity?: SalesActivity;
}

const SalesRepFeedback: React.FC = () => {
  const [allFeedback, setAllFeedback] = useState<FeedbackWithActivity[]>([]);
  const [filteredFeedback, setFilteredFeedback] = useState<FeedbackWithActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAllFeedback();
  }, []);

  const loadAllFeedback = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [francoFeedback, freekFeedback, jeckieFeedback] = await Promise.all([
        getFeedbackWithActivities('franco'),
        getFeedbackWithActivities('freek'),
        getFeedbackWithActivities('jeckie')
      ]);

      const combinedFeedback = [...francoFeedback, ...freekFeedback, ...jeckieFeedback]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      setAllFeedback(combinedFeedback);
      setFilteredFeedback(combinedFeedback);
    } catch (error) {
      console.error('Failed to load feedback:', error);
      setError('Failed to load feedback. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    const searchTerm = query.toLowerCase();
    const filtered = allFeedback.filter(feedback => {
      const activity = feedback.activity;
      if (!activity) return false;

      return (
        activity.customerName.toLowerCase().includes(searchTerm) ||
        activity.company.toLowerCase().includes(searchTerm) ||
        feedback.note.toLowerCase().includes(searchTerm) ||
        feedback.repId.toLowerCase().includes(searchTerm)
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

  const getRepName = (repId: string) => {
    return repId.charAt(0).toUpperCase() + repId.slice(1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={loadAllFeedback}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-900">Sales Rep Feedback</h2>
      </div>

      <div className="mb-6">
        <FeedbackSearch onSearch={handleSearch} />
      </div>
      
      <div className="space-y-4">
        {filteredFeedback.map(feedback => (
          <div key={feedback.id} className="bg-gray-50 rounded-lg p-4">
            {feedback.activity ? (
              <>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">
                        {feedback.activity.customerName}
                      </h3>
                      <span className="text-sm text-blue-600 font-medium">
                        ({getRepName(feedback.repId)})
                      </span>
                    </div>
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
            {allFeedback.length === 0 ? 'No feedback available yet' : 'No matching feedback found'}
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesRepFeedback;