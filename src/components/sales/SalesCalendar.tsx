import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock, Trash2, Pencil } from 'lucide-react';
import SalesActivityModal from './SalesActivityModal';
import { getSalesActivitiesByDate, deleteSalesActivity } from '../../services/salesActivityService';
import { SalesActivity } from '../../types/salesActivity';

interface SalesCalendarProps {
  repId: string;
}

const SalesCalendar: React.FC<SalesCalendarProps> = ({ repId }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<SalesActivity | null>(null);
  const [activities, setActivities] = useState<Record<string, SalesActivity[]>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletedIds] = useState(new Set<string>());

  const loadActivities = async (forceRefresh = false) => {
    try {
      if (!forceRefresh && loading) return;
      
      setLoading(true);
      setError(null);
      
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      const monthActivities = await getSalesActivitiesByDate(repId, startOfMonth, endOfMonth);
      
      // Filter out any activities that were previously deleted
      const filteredActivities = monthActivities.filter(activity => !deletedIds.has(activity.id));
      
      const grouped = filteredActivities.reduce((acc, activity) => {
        const date = new Date(activity.date).toISOString().split('T')[0];
        acc[date] = [...(acc[date] || []), activity];
        return acc;
      }, {} as Record<string, SalesActivity[]>);
      
      setActivities(grouped);
    } catch (error) {
      console.error('Failed to load activities:', error);
      setActivities({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivities();
  }, [currentDate, repId]);

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
    setIsModalOpen(true);
  };

  const handleEdit = (activity: SalesActivity, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedActivity(activity);
    setSelectedDate(new Date(activity.date));
    setIsRescheduling(false);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleReschedule = (activity: SalesActivity, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedActivity(activity);
    setSelectedDate(new Date(activity.date));
    setIsRescheduling(true);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleDelete = async (activity: SalesActivity, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDeleting) return;
    
    if (!window.confirm('Are you sure you want to delete this activity?')) {
      return;
    }

    try {
      setIsDeleting(true);
      setError(null);

      // Delete from database
      await deleteSalesActivity(activity.id);
      
      // Add to deleted IDs set to prevent reappearing
      deletedIds.add(activity.id);
      
      // Remove from local state immediately
      const activityDate = new Date(activity.date).toISOString().split('T')[0];
      setActivities(prev => {
        const updated = { ...prev };
        if (updated[activityDate]) {
          updated[activityDate] = updated[activityDate].filter(a => a.id !== activity.id);
          if (updated[activityDate].length === 0) {
            delete updated[activityDate];
          }
        }
        return updated;
      });

      // Force refresh to ensure sync
      await loadActivities(true);
    } catch (error) {
      console.error('Failed to delete activity:', error);
      setError('Failed to delete activity. Please try again.');
      await loadActivities(true); // Force refresh to ensure UI matches server state
    } finally {
      setIsDeleting(false);
    }
  };

  const handleActivityAdded = async () => {
    // Force refresh activities after adding new one
    await loadActivities(true);
  };

  const getActivityColor = (type: SalesActivity['type']) => {
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
                    onClick={(e) => handleDelete(activity, e)}
                    className="p-1 hover:bg-white/50 rounded"
                    title="Delete"
                    disabled={isDeleting}
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

  if (loading && !Object.keys(activities).length) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-gray-900">Activity Calendar</h2>
          <div className="text-sm text-gray-500">
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

      {selectedDate && (
        <SalesActivityModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedDate(null);
            setSelectedActivity(null);
            setIsEditing(false);
            setIsRescheduling(false);
          }}
          date={selectedDate}
          repId={repId}
          onActivityAdded={handleActivityAdded}
          activity={selectedActivity}
          isRescheduling={isRescheduling}
          isEditing={isEditing}
        />
      )}
    </div>
  );
};

export default SalesCalendar;