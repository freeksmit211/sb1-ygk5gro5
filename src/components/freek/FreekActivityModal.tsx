import React, { useState, useEffect } from 'react';
import { X, Clock, Save, Trash2 } from 'lucide-react';
import { addFreekActivity, updateFreekActivity, deleteFreekActivity } from '../../services/freekActivityService';
import { FreekActivity } from '../../types/freekActivity';

interface FreekActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date;
  onActivityAdded: () => void;
  activity?: FreekActivity | null;
  isEditing?: boolean;
  isRescheduling?: boolean;
}

const FreekActivityModal: React.FC<FreekActivityModalProps> = ({
  isOpen,
  onClose,
  date,
  onActivityAdded,
  activity,
  isEditing,
  isRescheduling
}) => {
  const [formData, setFormData] = useState({
    description: '',
    type: 'meeting' as const,
    customerName: '',
    company: '',
    time: '09:00',
    date: date.toISOString().split('T')[0]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (activity) {
      const activityDate = new Date(activity.date);
      setFormData({
        description: activity.description,
        type: activity.type,
        customerName: activity.customerName,
        company: activity.company,
        time: activity.time || '09:00',
        date: activityDate.toISOString().split('T')[0]
      });
    } else {
      setFormData({
        description: '',
        type: 'meeting',
        customerName: '',
        company: '',
        time: '09:00',
        date: date.toISOString().split('T')[0]
      });
    }
  }, [activity, date]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      const activityDate = new Date(formData.date);
      const [hours, minutes] = formData.time.split(':');
      activityDate.setHours(parseInt(hours), parseInt(minutes));

      if (isEditing || isRescheduling) {
        if (!activity) return;
        await updateFreekActivity(activity.id, {
          ...activity,
          date: activityDate.toISOString(),
          description: formData.description,
          type: formData.type,
          customerName: formData.customerName,
          company: formData.company,
          time: formData.time
        });
      } else {
        await addFreekActivity({
          date: activityDate.toISOString(),
          description: formData.description,
          type: formData.type,
          customerName: formData.customerName,
          company: formData.company,
          status: 'scheduled',
          time: formData.time
        });
      }

      onActivityAdded();
      onClose();
    } catch (error) {
      console.error('Failed to save activity:', error);
      alert('Failed to save activity. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!activity) return;
    if (!window.confirm('Are you sure you want to delete this activity?')) return;

    try {
      setIsSubmitting(true);
      await deleteFreekActivity(activity.id);
      onActivityAdded();
      onClose();
    } catch (error) {
      console.error('Failed to delete activity:', error);
      alert('Failed to delete activity. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="px-6 py-4 bg-blue-600 flex justify-between items-center rounded-t-lg">
          <h3 className="text-xl font-bold text-white">
            {isRescheduling ? 'Reschedule Activity' : isEditing ? 'Edit Activity' : 'Add Activity'}
          </h3>
          <button onClick={onClose} className="text-white hover:text-blue-100">
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Customer Name</label>
            <input
              type="text"
              value={formData.customerName}
              onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
              required
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Company</label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
              required
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
              rows={3}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                required
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Time</label>
              <div className="relative mt-1">
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 pr-10"
                  required
                  disabled={isSubmitting}
                />
                <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
              required
              disabled={isSubmitting}
            >
              <option value="meeting">Meeting</option>
              <option value="call">Call</option>
              <option value="quote">Quote</option>
              <option value="order">Order</option>
              <option value="delivery">Delivery</option>
            </select>
          </div>

          <div className="flex justify-between items-center gap-4 pt-4 border-t">
            {/* Left side - Delete button (only show for edit/reschedule) */}
            <div>
              {(isEditing || isRescheduling) && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  disabled={isSubmitting}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              )}
            </div>

            {/* Right side - Cancel and Save/Update buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    {isRescheduling ? (
                      <>
                        <Clock className="w-4 h-4" />
                        <span>Reschedule</span>
                      </>
                    ) : isEditing ? (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save Changes</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Add Activity</span>
                      </>
                    )}
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FreekActivityModal;