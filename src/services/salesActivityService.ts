import { supabase } from '../lib/supabase';
import { SalesActivity } from '../types/salesActivity';

export const addSalesActivity = async (activity: Omit<SalesActivity, 'id'>): Promise<string> => {
  try {
    const selectedDate = new Date(activity.date);
    
    const { data, error } = await supabase
      .from('sales_activities')
      .insert({
        date: selectedDate.toISOString(),
        time: activity.time,
        description: activity.description,
        type: activity.type,
        customer_name: activity.customerName,
        company: activity.company,
        status: activity.status,
        rep_id: activity.repId
      })
      .select()
      .single();

    if (error) throw error;
    return data.id;
  } catch (error) {
    console.error('Error adding sales activity:', error);
    throw error;
  }
};

export const updateSalesActivity = async (id: string, activity: SalesActivity): Promise<void> => {
  try {
    const selectedDate = new Date(activity.date);
    
    const { error } = await supabase
      .from('sales_activities')
      .update({
        date: selectedDate.toISOString(),
        time: activity.time,
        description: activity.description,
        type: activity.type,
        customer_name: activity.customerName,
        company: activity.company,
        status: activity.status
      })
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating sales activity:', error);
    throw error;
  }
};

export const deleteSalesActivity = async (id: string): Promise<void> => {
  try {
    // First delete any associated feedback
    const { error: feedbackError } = await supabase
      .from('sales_feedback')
      .delete()
      .eq('activity_id', id);

    if (feedbackError) {
      console.error('Error deleting feedback:', feedbackError);
      throw feedbackError;
    }

    // Then delete the activity
    const { error: activityError } = await supabase
      .from('sales_activities')
      .delete()
      .eq('id', id);

    if (activityError) {
      console.error('Error deleting activity:', activityError);
      throw activityError;
    }

    // Verify the activity was deleted
    const { data: checkActivity } = await supabase
      .from('sales_activities')
      .select('id')
      .eq('id', id)
      .maybeSingle();

    if (checkActivity) {
      throw new Error('Failed to delete activity');
    }
  } catch (error) {
    console.error('Error deleting sales activity:', error);
    throw error;
  }
};

export const getSalesActivitiesByDate = async (
  repId: string,
  startDate: Date,
  endDate: Date
): Promise<SalesActivity[]> => {
  try {
    const { data, error } = await supabase
      .from('sales_activities')
      .select('*')
      .eq('rep_id', repId)
      .gte('date', startDate.toISOString())
      .lte('date', endDate.toISOString())
      .order('date', { ascending: true });

    if (error) throw error;

    return data.map(activity => ({
      id: activity.id,
      date: activity.date,
      time: activity.time || '09:00',
      description: activity.description,
      type: activity.type,
      customerName: activity.customer_name,
      company: activity.company,
      status: activity.status,
      repId: activity.rep_id
    }));
  } catch (error) {
    console.error('Error fetching sales activities:', error);
    throw error;
  }
};