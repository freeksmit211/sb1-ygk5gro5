import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock, Trash2, Pencil, MessageSquare, X } from 'lucide-react';
import SalesActivityModal from '../sales/SalesActivityModal';
import JeckieActivityDetailsModal from './JeckieActivityDetailsModal';
import JeckieFeedbackList from './JeckieFeedbackList';
import { getJeckieActivitiesByDate, deleteJeckieActivity } from '../../services/jeckieActivityService';
import { JeckieActivity } from '../../types/jeckieActivity';
import { addFeedback } from '../../services/jeckieFeedbackService';

const JeckieCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<JeckieActivity | null>(null);
  const [activities, setActivities] = useState<Record<string, JeckieActivity[]>>({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [isConvertingToFeedback, setIsConvertingToFeedback] = useState(false);
  const [feedbackNote, setFeedbackNote] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadActivities();
  }, [currentDate]);

  const loadActivities = async () => {
    try {
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      const monthActivities = await getJeckieActivitiesByDate(startOfMonth, endOfMonth);
      
      const grouped = monthActivities.reduce((acc, activity) => {
        const date = new Date(activity.date).toISOString().split('T')[0];
        acc[date] = [...(acc[date] || []), activity];
        return acc;
      }, {} as Record<string, JeckieActivity[]>);
      
      setActivities(grouped);
    } catch (error) {
      console.error('Failed to load activities:', error);
      setActivities({});
    }
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setSelectedActivity(null);
    setIsRescheduling(false);
    setIsEditing(false);
    setIsAddModalOpen(true);
  };

  const handleEdit = (activity: JeckieActivity, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedActivity(activity);
    setSelectedDate(new Date(activity.date));
    setIsRescheduling(false);
    setIsEditing(true);
    setIsAddModalOpen(true);
  };

  const handleReschedule = (activity: JeckieActivity, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedActivity(activity);
    setSelectedDate(new Date(activity.date));
    setIsRescheduling(true);
    setIsEditing(false);
    setIsAddModalOpen(true);
  };

  const handleDelete = async (activity: JeckieActivity, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this activity?')) {
      return;
    }

    try {
      setError(null);
      await deleteJeckieActivity(activity.id);
      
      // Update local state to remove the deleted activity
      const activityDate = new Date(activity.date).toISOString().split('T')[0];
      const updatedActivities = { ...activities };
      
      if (updatedActivities[activityDate]) {
        updatedActivities[activityDate] = updatedActivities[activityDate].filter(
          a => a.id !== activity.id
        );
        
        // Remove the date key if no activities remain
        if (updatedActivities[activityDate].length === 0) {
          delete updatedActivities[activityDate];
        }
        
        setActivities(updatedActivities);
      }
    } catch (error) {
      console.error('Failed to delete activity:', error);
      setError('Failed to delete activity. Please try again.');
    }
  };

  const handleConvertToFeedback = async (activity: JeckieActivity, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedActivity(activity);
    setIsConvertingToFeedback(true);
  };

  const handleFeedbackSubmit = async () => {
    if (!selectedActivity || !feedbackNote.trim()) return;

    try {
      await addFeedback({
        activityId: selectedActivity.id,
        note: feedbackNote.trim()
      });

      // Reset state
      setSelectedActivity(null);
      setFeedbackNote('');
      setIsConvertingToFeedback(false);

      // Reload activities
      await loadActivities();
    } catch (error) {
      console.error('Failed to convert to feedback:', error);
      alert('Failed to convert activity to feedback. Please try again.');
    }
  };

  const getActivityColor = (type: JeckieActivity['type']) => {
    switch (type) {
      case 'meeting':
        return 'bg-blue-100 text-blue-800';
      case 'call':
        return 'bg-green-100 text-green-800';
      case 'quote':
        return 'bg-purple-100 text-purple-800';
      case 'order':
        return 'bg-orange-100 text-orange-800';
      case 'delivery':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderCalendar = () => {
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-32" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateString = date.toISOString().split('T')[0];
      const dayActivities = activities[dateString] || [];

      days.push(
        <div
          key={day}
          onClick={() => handleDateClick(date)}
          className="border border-gray-200 p-2 h-32 hover:bg-gray-50 cursor-pointer relative group overflow-auto"
        >
          <div className="font-semibold mb-1 flex justify-between items-center sticky top-0 bg-white z-10">
            <span>{day}</span>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity">
              <Plus className="w-4 h-4 text-blue-600" />
            </span>
          </div>
          <div className="space-y-1">
            {dayActivities.map((activity) => (
              <div
                key={activity.id}
                className={`text-xs p-2 rounded ${getActivityColor(activity.type)} cursor-pointer hover:opacity-80 relative group`}
              >
                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-white/50 rounded p-0.5">
                  <button
                    onClick={(e) => handleEdit(activity, e)}
                    className="p-1 hover:bg-white/50 rounded"
                    title="Edit"
                  >
                    <Pencil className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => handleReschedule(activity, e)}
                    className="p-1 hover:bg-white/50 rounded"
                    title="Reschedule"
                  >
                    <Clock className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => handleConvertToFeedback(activity, e)}
                    className="p-1 hover:bg-white/50 rounded"
                    title="Convert to Feedback"
                  >
                    <MessageSquare className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => handleDelete(activity, e)}
                    className="p-1 hover:bg-white/50 rounded"
                    title="Delete"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>

                <div className="pt-6">
                  <div className="font-medium">{activity.customerName}</div>
                  <div className="text-xs opacity-75">{activity.company}</div>
                  <div className="text-xs mt-1 capitalize">{activity.type}</div>
                  {activity.time && (
                    <div className="text-xs mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {activity.time}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-gray-900">Jeckie's Activities</h2>
            <div className="text-sm">
              {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="bg-gray-100 p-2 text-center font-semibold">
              {day}
            </div>
          ))}
          {renderCalendar()}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <JeckieFeedbackList />
      </div>

      {selectedDate && (
        <SalesActivityModal
          isOpen={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false);
            setSelectedDate(null);
            setSelectedActivity(null);
            setIsEditing(false);
            setIsRescheduling(false);
          }}
          date={selectedDate}
          repId="jeckie"
          onActivityAdded={loadActivities}
          activity={selectedActivity}
          isEditing={isEditing}
          isRescheduling={isRescheduling}
        />
      )}

      {/* Feedback Conversion Modal */}
      {isConvertingToFeedback && selectedActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="px-6 py-4 bg-blue-600 flex justify-between items-center rounded-t-lg">
              <h3 className="text-xl font-bold text-white">Convert to Feedback</h3>
              <button 
                onClick={() => {
                  setIsConvertingToFeedback(false);
                  setSelectedActivity(null);
                  setFeedbackNote('');
                }} 
                className="text-white hover:text-blue-100"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <div className="text-sm text-gray-600">Activity</div>
                <div className="font-medium text-gray-900">{selectedActivity.customerName}</div>
                <div className="text-sm text-gray-600">{selectedActivity.company}</div>
                <div className="text-sm text-gray-600 mt-1">{selectedActivity.description}</div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Feedback</label>
                <textarea
                  value={feedbackNote}
                  onChange={(e) => setFeedbackNote(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                  rows={4}
                  placeholder="Enter your feedback..."
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsConvertingToFeedback(false);
                    setSelectedActivity(null);
                    setFeedbackNote('');
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleFeedbackSubmit}
                  disabled={!feedbackNote.trim()}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  Submit Feedback
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JeckieCalendar;