import React, { useState } from 'react';
import { X } from 'lucide-react';
import { addMeeting } from '../../services/meetingService';

interface MeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date;
  onMeetingAdded: () => void;
}

const SALES_REPS = ['Franco', 'Freek', 'Jeckie'];

const MeetingModal: React.FC<MeetingModalProps> = ({
  isOpen,
  onClose,
  date,
  onMeetingAdded
}) => {
  const [formData, setFormData] = useState({
    customerName: '',
    description: '',
    selectedDate: date.toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '10:00',
    selectedAttendees: [] as string[],
    company: '',
    location: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addMeeting({
        customerName: formData.customerName,
        date: new Date(formData.selectedDate).toISOString(),
        description: formData.description,
        startTime: formData.startTime,
        endTime: formData.endTime,
        attendees: formData.selectedAttendees,
        company: formData.company,
        location: formData.location,
        status: 'scheduled'
      });
      onMeetingAdded();
      onClose();
    } catch (error) {
      console.error('Failed to add meeting:', error);
    }
  };

  const handleAttendeeChange = (attendee: string) => {
    setFormData(prev => ({
      ...prev,
      selectedAttendees: prev.selectedAttendees.includes(attendee)
        ? prev.selectedAttendees.filter(a => a !== attendee)
        : [...prev.selectedAttendees, attendee]
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="px-6 py-4 bg-blue-600 flex justify-between items-center rounded-t-lg">
          <h3 className="text-xl font-bold text-white">Schedule Meeting</h3>
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
              placeholder="Name of the person chairing the meeting"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
              rows={3}
              placeholder="Meeting details"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Company (Meeting Location)</label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
              placeholder="Company where the meeting will be held"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Specific Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
              placeholder="e.g., Conference Room, Office Number"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              value={formData.selectedDate}
              onChange={(e) => setFormData(prev => ({ ...prev, selectedDate: e.target.value }))}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Time</label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Time</label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Attendees</label>
            <div className="space-y-2">
              {SALES_REPS.map(rep => (
                <label key={rep} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.selectedAttendees.includes(rep)}
                    onChange={() => handleAttendeeChange(rep)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">{rep}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Schedule Meeting
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MeetingModal;