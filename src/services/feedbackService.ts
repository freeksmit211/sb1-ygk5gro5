import { supabase } from '../lib/supabase';
import { SalesFeedback } from '../types/salesFeedback';
import { SalesActivity } from '../types/salesActivity';

interface FeedbackWithActivity extends SalesFeedback {
  activity?: SalesActivity;
}

export const getFeedbackWithActivities = async (repId: string): Promise<FeedbackWithActivity[]> => {
  try {
    const { data, error } = await supabase
      .from('sales_feedback')
      .select(`
        *,
        activity:sales_activities(*)
      `)
      .eq('rep_id', repId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(feedback => ({
      id: feedback.id,
      activityId: feedback.activity_id,
      repId: feedback.rep_id,
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
        status: feedback.activity.status,
        repId: feedback.activity.rep_id
      } : undefined
    }));
  } catch (error) {
    console.error('Error getting feedback:', error);
    return [];
  }
};

export const getFeedbackForActivity = async (activityId: string, repId: string): Promise<SalesFeedback | null> => {
  try {
    const { data, error } = await supabase
      .from('sales_feedback')
      .select('*')
      .eq('activity_id', activityId)
      .eq('rep_id', repId)
      .maybeSingle(); // Use maybeSingle() instead of single()

    if (error) throw error;
    
    if (!data) return null;

    return {
      id: data.id,
      activityId: data.activity_id,
      repId: data.rep_id,
      note: data.note,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  } catch (error) {
    console.error('Error getting feedback:', error);
    return null;
  }
};

export const addFeedback = async (feedback: { activityId: string; note: string; repId: string }): Promise<void> => {
  try {
    const { error } = await supabase
      .from('sales_feedback')
      .insert({
        activity_id: feedback.activityId,
        note: feedback.note,
        rep_id: feedback.repId
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error adding feedback:', error);
    throw error;
  }
};