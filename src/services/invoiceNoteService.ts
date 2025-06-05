import { supabase } from '../lib/supabase';
import { InvoiceNote, NewInvoiceNote } from '../types/invoiceNote';

export const addInvoiceNote = async (note: NewInvoiceNote): Promise<string> => {
  try {
    const { data, error } = await supabase
      .from('invoice_notes')
      .insert({
        invoice_id: note.invoiceId,
        note: note.note
      })
      .select()
      .single();

    if (error) throw error;
    return data.id;
  } catch (error) {
    console.error('Error adding invoice note:', error);
    throw error;
  }
};

export const getInvoiceNotes = async (invoiceId: string): Promise<InvoiceNote[]> => {
  try {
    const { data, error } = await supabase
      .from('invoice_notes')
      .select('*')
      .eq('invoice_id', invoiceId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(note => ({
      id: note.id,
      invoiceId: note.invoice_id,
      note: note.note,
      createdAt: note.created_at
    }));
  } catch (error) {
    console.error('Error getting invoice notes:', error);
    throw error;
  }
};