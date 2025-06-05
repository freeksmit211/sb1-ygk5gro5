import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import MeetingModal from './MeetingModal';
import { getMeetingsByDate } from '../../services/meetingService';
import { Meeting } from '../../types/meeting';
import MeetingCard from './MeetingCard';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';

const MeetingCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [meetings, setMeetings] = useState<Record<string, Meeting[]>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMeetings();
  }, [currentDate]);

  const loadMeetings = async () => {
    try {
      setLoading(true);
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      const monthMeetings = await getMeetingsByDate(startOfMonth, endOfMonth);
      
      const grouped = monthMeetings.reduce((acc, meeting) => {
        const date = meeting.date.split('T')[0];
        acc[date] = [...(acc[date] || []), meeting];
        return acc;
      }, {} as Record<string, Meeting[]>);
      
      setMeetings(grouped);
    } catch (error) {
      console.error('Failed to load meetings:', error);
    } finally {
      setLoading(false);
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
    setIsModalOpen(true);
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
      <CalendarHeader
        currentDate={currentDate}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
      />

      <CalendarGrid
        currentDate={currentDate}
        meetings={meetings}
        onDateClick={handleDateClick}
      />

      {selectedDate && (
        <MeetingModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedDate(null);
          }}
          date={selectedDate}
          onMeetingAdded={loadMeetings}
        />
      )}
    </div>
  );
};

export default MeetingCalendar;