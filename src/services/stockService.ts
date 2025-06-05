import { supabase } from '../lib/supabase';
import { StockItem, NewStockItem } from '../types/stock';

export const addStockItem = async (item: NewStockItem): Promise<string> => {
  try {
    const { data, error } = await supabase
      .from('stock_items')
      .insert({
        item_name: item.itemName,
        quantity: item.quantity,
        client_name: item.clientName,
        client_company: item.clientCompany,
        assigned_to: item.assignedTo,
        notes: item.notes,
        status: 'ready'
      })
      .select()
      .single();

    if (error) throw error;
    return data.id;
  } catch (error) {
    console.error('Error adding stock item:', error);
    throw error;
  }
};

export const getStockItems = async (): Promise<StockItem[]> => {
  try {
    const { data, error } = await supabase
      .from('stock_items')
      .select('*')
      .eq('status', 'ready')
      .order('submitted_at', { ascending: false });

    if (error) throw error;

    return data.map(item => ({
      id: item.id,
      itemName: item.item_name,
      quantity: item.quantity,
      clientName: item.client_name,
      clientCompany: item.client_company,
      assignedTo: item.assigned_to,
      notes: item.notes,
      status: item.status,
      submittedAt: item.submitted_at
    }));
  } catch (error) {
    console.error('Error getting stock items:', error);
    throw error;
  }
};

export const pickupStockItem = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('stock_items')
      .update({ status: 'shipped' })
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error marking stock item as picked up:', error);
    throw error;
  }
};