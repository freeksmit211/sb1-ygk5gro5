import { supabase } from '../lib/supabase';
import { OrderNote } from '../types/order';

export const addOrderNote = async (note: { orderId: string; note: string }): Promise<string> => {
  try {
    const { data, error } = await supabase
      .from('order_notes')
      .insert({
        order_id: note.orderId,
        note: note.note
      })
      .select()
      .single();

    if (error) throw error;
    return data.id;
  } catch (error) {
    console.error('Error adding order note:', error);
    throw error;
  }
};

export const getOrderNotes = async (orderId: string): Promise<OrderNote[]> => {
  try {
    const { data, error } = await supabase
      .from('order_notes')
      .select('*')
      .eq('order_id', orderId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(note => ({
      id: note.id,
      orderId: note.order_id,
      note: note.note,
      createdAt: note.created_at
    }));
  } catch (error) {
    console.error('Error getting order notes:', error);
    throw error;
  }
};