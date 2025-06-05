import { addFreekActivity } from '../freekActivityService';
import { addFrancoActivity } from '../francoActivityService';
import { addJeckieActivity } from '../jeckieActivityService';
import { Meeting } from '../../types/meeting';

export const createActivitiesForAttendees = async (meeting: Omit<Meeting, 'id'>): Promise<void> => {
  const activityData = {
    date: meeting.date,
    description: `Meeting with ${meeting.customerName}\n${meeting.description || ''}\nLocation: ${meeting.location}\nCompany: ${meeting.company}`,
    type: 'meeting' as const,
    customerName: meeting.customerName,
    company: meeting.company,
    status: 'scheduled' as const
  };

  // Create activities for each attendee in parallel
  const attendeePromises = meeting.attendees.map(async (attendee) => {
    try {
      switch (attendee.toLowerCase()) {
        case 'freek':
          return await addFreekActivity(activityData);
        case 'franco':
          return await addFrancoActivity(activityData);
        case 'jeckie':
          return await addJeckieActivity(activityData);
        default:
          return null;
      }
    } catch (error) {
      console.error(`Failed to create activity for ${attendee}:`, error);
      return null;
    }
  });

  await Promise.all(attendeePromises);
};