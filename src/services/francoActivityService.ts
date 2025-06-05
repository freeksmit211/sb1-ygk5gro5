import { supabase } from '../lib/supabase';
import { FrancoActivity } from '../types/francoActivity';

export const addFrancoActivity = async (activity: Omit<FrancoActivity, 'id'>): Promise<string> => {
  try {
    const { data, error } = await supabase
      .from('sales_activities')
      .insert({
        date: activity.date,
        description: activity.description,
        type: activity.type,
        customer_name: activity.customerName,
        company: activity.company,
        status: activity.status,
        rep_id: 'franco',
        time: activity.time
      })
      .select()
      .single();

    if (error) throw error;
    return data.id;
  } catch (error) {
    console.error('Error adding Franco activity:', error);
    throw error;
  }
};

export const updateFrancoActivity = async (id: string, activity: FrancoActivity): Promise<void> => {
  try {
    const { error } = await supabase
      .from('sales_activities')
      .update({
        date: activity.date,
        description: activity.description,
        type: activity.type,
        customer_name: activity.customerName,
        company: activity.company,
        status: activity.status,
        time: activity.time
      })
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating Franco activity:', error);
    throw error;
  }
};

export const deleteFrancoActivity = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('sales_activities')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting Franco activity:', error);
    throw error;
  }
};

export const getFrancoActivitiesByDate = async (
  startDate: Date,
  endDate: Date
): Promise<FrancoActivity[]> => {
  try {
    const { data, error } = await supabase
      .from('sales_activities')
      .select('*')
      .eq('rep_id', 'franco')
      .gte('date', startDate.toISOString())
      .lte('date', endDate.toISOString())
      .order('date', { ascending: true });

    if (error) throw error;

    return data.map(activity => ({
      id: activity.id,
      date: activity.date,
      description: activity.description,
      type: activity.type,
      customerName: activity.customer_name,
      company: activity.company,
      status: activity.status,
      time: activity.time || '09:00'
    }));
  } catch (error) {
    console.error('Error fetching Franco activities:', error);
    throw error;
  }
};