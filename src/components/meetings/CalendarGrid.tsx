import React from 'react';
import { Plus } from 'lucide-react';
import { Meeting } from '../../types/meeting';
import MeetingCard from './MeetingCard';

interface CalendarGridProps {
  currentDate: Date;
  meetings: Record<string, Meeting[]>;
  onDateClick: (date: Date) => void;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({
  currentDate,
  meetings,
  onDateClick
}) => {
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-32" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateString = date.toISOString().split('T')[0];
      const dayMeetings = meetings[dateString] || [];

      days.push(
        <div
          key={day}
          onClick={() => onDateClick(date)}
          className="border border-gray-200 p-2 h-32 hover:bg-gray-50 cursor-pointer relative group overflow-auto"
        >
          <div className="font-semibold mb-1 flex justify-between items-center sticky top-0 bg-white">
            <span>{day}</span>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity">
              <Plus className="w-4 h-4 text-blue-600" />
            </span>
          </div>
          <div className="space-y-1">
            {dayMeetings.map((meeting) => (
              <MeetingCard key={meeting.id} meeting={meeting} />
            ))}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="grid grid-cols-7 gap-px bg-gray-200">
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
        <div key={day} className="bg-gray-100 p-2 text-center font-semibold">
          {day}
        </div>
      ))}
      {renderCalendar()}
    </div>
  );
};

export default CalendarGrid;