import { supabase } from '../../lib/supabase';
import { Meeting } from '../../types/meeting';
import { createActivitiesForAttendees } from './meetingActivities';

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
    await createActivitiesForAttendees(meeting);

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