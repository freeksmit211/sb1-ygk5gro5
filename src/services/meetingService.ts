import { supabase } from '../lib/supabase';
import { Meeting } from '../types/meeting';
import { addFreekActivity } from './freekActivityService';
import { addFrancoActivity } from './francoActivityService';
import { addJeckieActivity } from './jeckieActivityService';

export const addMeeting = async (meeting: Omit<Meeting, 'id'>): Promise<string> => {
  try {
    // Create the meeting
    const { data, error } = await supabase
      .from('calendar_meetings')
      .insert({
        customer_name: meeting.customerName,
        description: meeting.description,
        date: meeting.date,
        start_time: meeting.startTime,
        end_time: meeting.endTime,
        attendees: meeting.attendees,
        company: meeting.company,
        location: meeting.location,
        status: meeting.status
      })
      .select()
      .single();

    if (error) throw error;

    // Create activities for each attendee
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
    return data.id;
  } catch (error) {
    console.error('Error adding meeting:', error);
    throw error;
  }
};

export const getMeetingsByDate = async (
  startDate: Date,
  endDate: Date
): Promise<Meeting[]> => {
  try {
    const { data, error } = await supabase
      .from('calendar_meetings')
      .select('*')
      .gte('date', startDate.toISOString())
      .lte('date', endDate.toISOString())
      .order('date', { ascending: true });

    if (error) throw error;

    return data.map(meeting => ({
      id: meeting.id,
      customerName: meeting.customer_name,
      description: meeting.description,
      date: meeting.date,
      startTime: meeting.start_time,
      endTime: meeting.end_time,
      attendees: meeting.attendees,
      company: meeting.company,
      location: meeting.location,
      status: meeting.status
    }));
  } catch (error) {
    console.error('Error fetching meetings:', error);
    throw error;
  }
};