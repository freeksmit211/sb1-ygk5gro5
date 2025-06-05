import { supabase } from '../lib/supabase';
import { JeckieActivity } from '../types/jeckieActivity';

export const addJeckieActivity = async (activity: Omit<JeckieActivity, 'id'>): Promise<string> => {
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
        rep_id: 'jeckie',
        time: activity.time
      })
      .select()
      .single();

    if (error) throw error;
    return data.id;
  } catch (error) {
    console.error('Error adding Jeckie activity:', error);
    throw error;
  }
};

export const updateJeckieActivity = async (id: string, activity: JeckieActivity): Promise<void> => {
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
    console.error('Error updating Jeckie activity:', error);
    throw error;
  }
};

export const deleteJeckieActivity = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('sales_activities')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting Jeckie activity:', error);
    throw error;
  }
};

export const getJeckieActivitiesByDate = async (
  startDate: Date,
  endDate: Date
): Promise<JeckieActivity[]> => {
  try {
    const { data, error } = await supabase
      .from('sales_activities')
      .select('*')
      .eq('rep_id', 'jeckie')
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
    console.error('Error fetching Jeckie activities:', error);
    throw error;
  }
};