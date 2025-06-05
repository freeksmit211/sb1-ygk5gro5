import { supabase } from '../lib/supabase';
import { Delivery } from '../types/delivery';

export const addDelivery = async (delivery: Omit<Delivery, 'id'>): Promise<string> => {
  try {
    const { data, error } = await supabase
      .from('calendar_deliveries')
      .insert({
        date: delivery.date,
        area: delivery.area,
        company: delivery.company,
        vehicle: delivery.vehicle,
        driver: delivery.driver,
        item: delivery.item,
        notes: delivery.notes,
        status: delivery.status
      })
      .select()
      .single();

    if (error) throw error;
    return data.id;
  } catch (error) {
    console.error('Error adding delivery:', error);
    throw error;
  }
};

export const getDeliveriesByDate = async (
  startDate: Date,
  endDate: Date
): Promise<Delivery[]> => {
  try {
    const { data, error } = await supabase
      .from('calendar_deliveries')
      .select('*')
      .gte('date', startDate.toISOString())
      .lte('date', endDate.toISOString())
      .order('date', { ascending: true });

    if (error) throw error;

    return data.map(delivery => ({
      id: delivery.id,
      date: delivery.date,
      area: delivery.area,
      company: delivery.company,
      vehicle: delivery.vehicle,
      driver: delivery.driver,
      item: delivery.item,
      notes: delivery.notes,
      status: delivery.status
    }));
  } catch (error) {
    console.error('Error fetching deliveries:', error);
    throw error;
  }
};

export const updateDeliveryStatus = async (
  deliveryId: string,
  status: 'pending' | 'delivered',
  notes?: string
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('calendar_deliveries')
      .update({ 
        status,
        notes: notes || null
      })
      .eq('id', deliveryId);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating delivery status:', error);
    throw error;
  }
};