export interface Meeting {
  id: string;
  customerName: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  attendees: string[];
  company: string;
  location: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}