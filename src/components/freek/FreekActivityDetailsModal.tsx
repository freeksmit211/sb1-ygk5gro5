import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { FreekActivity } from '../../types/freekActivity';
import { FreekFeedback } from '../../types/freekFeedback';
import { addFeedback, getFeedbackForActivity } from '../../services/freekFeedbackService';

interface FreekActivityDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity: FreekActivity;
  onFeedbackAdded: () => void;
}

const FreekActivityDetailsModal: React.FC<FreekActivityDetailsModalProps> = ({
  isOpen,
  onClose,
  activity,
  onFeedbackAdded
}) => {
  const [feedback, setFeedback] = useState<FreekFeedback | null>(null);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadFeedback = async () => {
      const existingFeedback = await getFeedbackForActivity(activity.id);
      if (existingFeedback) {
        setFeedback(existingFeedback);
        setNote(existingFeedback.note);
      }
    };

    if (isOpen) {
      loadFeedback();
    }
  }, [activity.id, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) return;

    try {
      setIsSubmitting(true);
      await addFeedback({
        activityId: activity.id,
        note: note.trim()
      });
      onFeedbackAdded();
      onClose();
    } catch (error) {
      console.error('Failed to save feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="px-6 py-4 bg-blue-600 flex justify-between items-center rounded-t-lg">
          <h3 className="text-xl font-bold text-white">Activity Details</h3>
          <button onClick={onClose} className="text-white hover:text-blue-100">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Customer</p>
            <p className="text-lg text-gray-900">{activity.customerName}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Company</p>
            <p className="text-lg text-gray-900">{activity.company}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Type</p>
            <p className="text-lg text-gray-900 capitalize">{activity.type}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Description</p>
            <p className="text-lg text-gray-900">{activity.description}</p>
          </div>
          
          <form onSubmit={handleSubmit} className="mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Feedback Note
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                rows={4}
                placeholder="Enter your feedback here..."
                required
              />
            </div>
            <div className="mt-4 flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Save Feedback'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FreekActivityDetailsModal;