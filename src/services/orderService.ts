import { supabase } from '../lib/supabase';
import { Order, NewOrder } from '../types/order';

export const addOrder = async (order: NewOrder): Promise<string> => {
  try {
    const { data, error } = await supabase
      .from('outstanding_orders')
      .insert({
        order_number: order.orderNumber,
        customer: order.customer,
        responsible_person: order.responsiblePerson,
        lead_time: order.leadTime,
        notes: order.notes,
        status: 'new'
      })
      .select()
      .single();

    if (error) throw error;
    return data.id;
  } catch (error) {
    console.error('Error adding order:', error);
    throw error;
  }
};

export const getOrders = async (): Promise<Order[]> => {
  try {
    const { data, error } = await supabase
      .from('outstanding_orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(order => ({
      id: order.id,
      orderNumber: order.order_number,
      customer: order.customer,
      responsiblePerson: order.responsible_person,
      leadTime: order.lead_time,
      createdAt: order.created_at,
      status: order.status,
      notes: order.notes
    }));
  } catch (error) {
    console.error('Error getting orders:', error);
    throw error;
  }
};

export const updateOrderStatus = async (id: string, status: Order['status']): Promise<void> => {
  try {
    const { error } = await supabase
      .from('outstanding_orders')
      .update({ status })
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

export const updateOrder = async (id: string, updates: Partial<Order>): Promise<void> => {
  try {
    const { error } = await supabase
      .from('outstanding_orders')
      .update({
        order_number: updates.orderNumber,
        customer: updates.customer,
        responsible_person: updates.responsiblePerson,
        lead_time: updates.leadTime,
        notes: updates.notes,
        status: updates.status
      })
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
};