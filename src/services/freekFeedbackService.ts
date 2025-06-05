import { supabase } from '../lib/supabase';
import { FreekFeedback } from '../types/freekFeedback';
import { FreekActivity } from '../types/freekActivity';

interface FeedbackWithActivity extends FreekFeedback {
  activity?: FreekActivity;
}

export const addFeedback = async (feedback: Omit<FreekFeedback, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const { data, error } = await supabase
      .from('sales_feedback')
      .insert({
        activity_id: feedback.activityId,
        note: feedback.note,
        rep_id: 'freek'
      })
      .select()
      .single();

    if (error) throw error;
    return data.id;
  } catch (error) {
    console.error('Error adding feedback:', error);
    throw error;
  }
};

export const getFeedbackForActivity = async (activityId: string): Promise<FreekFeedback | null> => {
  try {
    const { data, error } = await supabase
      .from('sales_feedback')
      .select('*')
      .eq('activity_id', activityId)
      .eq('rep_id', 'freek')
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    return {
      id: data.id,
      activityId: data.activity_id,
      note: data.note,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  } catch (error) {
    console.error('Error getting feedback:', error);
    return null;
  }
};

export const getFeedbackWithActivities = async (): Promise<FeedbackWithActivity[]> => {
  try {
    const { data, error } = await supabase
      .from('sales_feedback')
      .select(`
        *,
        activity:sales_activities(*)
      `)
      .eq('rep_id', 'freek')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(feedback => ({
      id: feedback.id,
      activityId: feedback.activity_id,
      note: feedback.note,
      createdAt: feedback.created_at,
      updatedAt: feedback.updated_at,
      activity: feedback.activity ? {
        id: feedback.activity.id,
        date: feedback.activity.date,
        description: feedback.activity.description,
        type: feedback.activity.type,
        customerName: feedback.activity.customer_name,
        company: feedback.activity.company,
        status: feedback.activity.status
      } : undefined
    }));
  } catch (error) {
    console.error('Error getting feedback:', error);
    return [];
  }
};