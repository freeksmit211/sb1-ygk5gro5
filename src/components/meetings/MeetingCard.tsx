import React from 'react';
import { Meeting } from '../../types/meeting';
import { MapPin, Building2, User } from 'lucide-react';

interface MeetingCardProps {
  meeting: Meeting;
}

const MeetingCard: React.FC<MeetingCardProps> = ({ meeting }) => {
  return (
    <div className="text-xs p-2 rounded bg-blue-100 text-blue-800 cursor-pointer hover:bg-blue-200">
      <div className="flex items-center gap-1">
        <User className="w-3 h-3" />
        <span className="font-medium">{meeting.customerName}</span>
      </div>
      <div className="text-blue-600">
        {meeting.startTime} - {meeting.endTime}
      </div>
      <div className="flex items-center gap-1 mt-1 text-blue-700">
        <Building2 className="w-3 h-3" />
        {meeting.company}
      </div>
      <div className="flex items-center gap-1 mt-1 text-blue-700">
        <MapPin className="w-3 h-3" />
        {meeting.location}
      </div>
      <div className="mt-1 text-blue-600">
        Attendees: {meeting.attendees.join(', ')}
      </div>
    </div>
  );
};

export default MeetingCard;