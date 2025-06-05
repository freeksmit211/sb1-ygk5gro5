import { supabase } from '../lib/supabase';
import { Notice, NewNotice } from '../types/notice';

export const addNotice = async (notice: NewNotice): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('notices')
      .insert({
        title: notice.title,
        content: notice.content,
        created_by: (await supabase.auth.getUser()).data.user?.id
      })
      .select()
      .single();

    if (error) throw error;
    return data.id;
  } catch (error) {
    console.error('Error adding notice:', error);
    return null;
  }
};

export const getNotices = async (): Promise<Notice[]> => {
  try {
    const { data, error } = await supabase
      .from('notices')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(notice => ({
      id: notice.id,
      title: notice.title,
      content: notice.content,
      createdAt: notice.created_at,
      createdBy: notice.created_by
    }));
  } catch (error) {
    console.error('Error getting notices:', error);
    return []; // Return empty array instead of throwing
  }
};