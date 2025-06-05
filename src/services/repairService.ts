import { supabase } from '../lib/supabase';
import { Repair, NewRepair } from '../types/repair';

export const addRepair = async (repair: NewRepair): Promise<string> => {
  try {
    const { data, error } = await supabase
      .from('repairs')
      .insert({
        customer_name: repair.customerName,
        job_number: repair.jobNumber,
        serial_number: repair.serialNumber,
        status: repair.status,
        item_description: repair.itemDescription,
        repair_description: repair.repairDescription
      })
      .select()
      .single();

    if (error) throw error;
    return data.id;
  } catch (error) {
    console.error('Error adding repair:', error);
    throw error;
  }
};

export const getRepairs = async (): Promise<Repair[]> => {
  try {
    const { data, error } = await supabase
      .from('repairs')
      .select('*')
      .neq('status', 'complete')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(repair => ({
      id: repair.id,
      date: repair.created_at,
      customerName: repair.customer_name,
      jobNumber: repair.job_number,
      serialNumber: repair.serial_number,
      status: repair.status,
      itemDescription: repair.item_description,
      repairDescription: repair.repair_description,
      createdAt: repair.created_at,
      updatedAt: repair.updated_at
    }));
  } catch (error) {
    console.error('Error getting repairs:', error);
    throw error;
  }
};

export const updateRepair = async (id: string, updates: Partial<NewRepair>): Promise<void> => {
  try {
    const { error } = await supabase
      .from('repairs')
      .update({
        customer_name: updates.customerName,
        job_number: updates.jobNumber,
        serial_number: updates.serialNumber,
        status: updates.status,
        item_description: updates.itemDescription,
        repair_description: updates.repairDescription
      })
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating repair:', error);
    throw error;
  }
};