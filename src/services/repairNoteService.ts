import { supabase } from '../lib/supabase';
import { RepairNote, NewRepairNote } from '../types/repairNote';

export const addRepairNote = async (note: NewRepairNote): Promise<string> => {
  try {
    const { data, error } = await supabase
      .from('repair_notes')
      .insert({
        repair_id: note.repairId,
        note: note.note
      })
      .select()
      .single();

    if (error) throw error;
    return data.id;
  } catch (error) {
    console.error('Error adding repair note:', error);
    throw error;
  }
};

export const getRepairNotes = async (repairId: string): Promise<RepairNote[]> => {
  try {
    const { data, error } = await supabase
      .from('repair_notes')
      .select('*')
      .eq('repair_id', repairId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(note => ({
      id: note.id,
      repairId: note.repair_id,
      note: note.note,
      createdAt: note.created_at
    }));
  } catch (error) {
    console.error('Error getting repair notes:', error);
    throw error;
  }
};