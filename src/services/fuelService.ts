import { supabase } from '../lib/supabase';
import { FuelEntry } from '../types/fuel';

export const addFuelEntry = async (entry: Omit<FuelEntry, 'id'>): Promise<string> => {
  try {
    const { data, error } = await supabase
      .from('forms_fuel')
      .insert({
        slip_number: entry.slipNumber,
        vehicle: entry.vehicle,
        driver: entry.driver,
        driver_name: entry.driverName,
        odometer: entry.odometer,
        pump_reading_before: entry.pumpReadingBefore,
        pump_reading_after: entry.pumpReadingAfter,
        liters: entry.liters,
        sales_rep_code: entry.salesRepCode
      })
      .select()
      .single();

    if (error) throw error;
    return data.id;
  } catch (error) {
    console.error('Error adding fuel entry:', error);
    throw error;
  }
};

export const updateFuelEntry = async (id: string, entry: Omit<FuelEntry, 'id'>): Promise<void> => {
  try {
    const { error } = await supabase
      .from('forms_fuel')
      .update({
        slip_number: entry.slipNumber,
        vehicle: entry.vehicle,
        driver: entry.driver,
        driver_name: entry.driverName,
        odometer: entry.odometer,
        pump_reading_before: entry.pumpReadingBefore,
        pump_reading_after: entry.pumpReadingAfter,
        liters: entry.liters,
        sales_rep_code: entry.salesRepCode
      })
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating fuel entry:', error);
    throw error;
  }
};

export const deleteFuelEntry = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('forms_fuel')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Database error:', error);
      throw new Error('Failed to delete fuel entry');
    }
  } catch (error) {
    console.error('Error deleting fuel entry:', error);
    throw error;
  }
};

export const getFuelEntries = async (): Promise<FuelEntry[]> => {
  try {
    const { data, error } = await supabase
      .from('forms_fuel')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(entry => ({
      id: entry.id,
      date: entry.created_at,
      slipNumber: entry.slip_number,
      vehicle: entry.vehicle,
      driver: entry.driver,
      driverName: entry.driver_name,
      odometer: entry.odometer,
      pumpReadingBefore: entry.pump_reading_before,
      pumpReadingAfter: entry.pump_reading_after,
      liters: entry.liters,
      salesRepCode: entry.sales_rep_code
    }));
  } catch (error) {
    console.error('Error getting fuel entries:', error);
    throw error;
  }
};