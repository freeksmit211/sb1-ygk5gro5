import { supabase } from '../lib/supabase';
import { SalesRepMapping } from '../types/salesRep';

export const getSalesRepMappings = async (): Promise<SalesRepMapping[]> => {
  try {
    const { data, error } = await supabase
      .from('sales_rep_allocations')
      .select('*')
      .order('code', { ascending: true });

    if (error) throw error;

    return data.map(mapping => ({
      id: mapping.id,
      code: mapping.code,
      currentName: mapping.name,
      createdAt: mapping.created_at,
      updatedAt: mapping.updated_at
    }));
  } catch (error) {
    console.error('Error getting sales rep mappings:', error);
    return [];
  }
};

export const updateSalesRepMapping = async (
  code: string,
  currentName: string
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('sales_rep_allocations')
      .update({ name: currentName })
      .eq('code', code);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating sales rep mapping:', error);
    throw error;
  }
};

export const getRepNameByCode = async (code: string): Promise<string> => {
  try {
    const { data, error } = await supabase
      .from('sales_rep_allocations')
      .select('name')
      .eq('code', code)
      .single();

    if (error) throw error;
    return data.name;
  } catch (error) {
    console.error('Error getting rep name:', error);
    return code; // Fallback to code if mapping not found
  }
};