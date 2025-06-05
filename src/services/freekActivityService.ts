import { supabase } from '../lib/supabase';
import { FreekActivity } from '../types/freekActivity';

export const addFreekActivity = async (activity: Omit<FreekActivity, 'id'>): Promise<string> => {
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
        rep_id: 'freek',
        time: activity.time
      })
      .select()
      .single();

    if (error) throw error;
    return data.id;
  } catch (error) {
    console.error('Error adding Freek activity:', error);
    throw error;
  }
};

export const updateFreekActivity = async (id: string, activity: FreekActivity): Promise<void> => {
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
    console.error('Error updating Freek activity:', error);
    throw error;
  }
};

export const deleteFreekActivity = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('sales_activities')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting Freek activity:', error);
    throw error;
  }
};

export const getFreekActivitiesByDate = async (
  startDate: Date,
  endDate: Date
): Promise<FreekActivity[]> => {
  try {
    const { data, error } = await supabase
      .from('sales_activities')
      .select('*')
      .eq('rep_id', 'freek')
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
    console.error('Error fetching Freek activities:', error);
    throw error;
  }
};