import { supabase } from '../lib/supabase';
import { VehicleService, NewVehicleService, VehicleBooking, NewVehicleBooking, PoolVehicle } from '../types/vehicle';

export const addVehicleService = async (service: NewVehicleService): Promise<string> => {
  try {
    // Validate input
    if (!service.vehicle) {
      throw new Error('Vehicle registration is required');
    }
    if (service.serviceKm < 0) {
      throw new Error('Service kilometer reading must be positive');
    }
    if (service.nextServiceKm <= service.serviceKm) {
      throw new Error('Next service kilometer reading must be greater than current reading');
    }

    // Insert the service record
    const { data, error } = await supabase
      .from('vehicle_services')
      .insert({
        vehicle: service.vehicle,
        service_km: service.serviceKm,
        next_service_km: service.nextServiceKm,
        notes: service.notes || null
      })
      .select('*')
      .single();

    if (error) {
      console.error('Database error:', error);
      throw new Error('Failed to save vehicle service record');
    }

    if (!data) {
      throw new Error('No data returned from database');
    }

    return data.id;
  } catch (error: any) {
    console.error('Error adding vehicle service:', error);
    throw error;
  }
};

export const getVehicleServices = async (): Promise<VehicleService[]> => {
  try {
    const { data, error } = await supabase
      .from('vehicle_services')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      throw new Error('Failed to fetch vehicle services');
    }

    return data.map(service => ({
      id: service.id,
      vehicle: service.vehicle,
      serviceKm: service.service_km,
      nextServiceKm: service.next_service_km,
      notes: service.notes,
      createdAt: service.created_at
    }));
  } catch (error: any) {
    console.error('Error getting vehicle services:', error);
    throw error;
  }
};

export const getVehicleLicenses = async () => {
  try {
    const { data, error } = await supabase
      .from('vehicle_licenses')
      .select('*')
      .order('expiry_date', { ascending: true });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting vehicle licenses:', error);
    throw error;
  }
};

export const updateVehicleLicense = async (
  vehicle: string,
  expiryDate: string
) => {
  try {
    const { error } = await supabase
      .from('vehicle_licenses')
      .upsert({
        vehicle,
        expiry_date: expiryDate,
        renewal_reminder_sent: false
      }, {
        onConflict: 'vehicle'
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error updating vehicle license:', error);
    throw error;
  }
};

export const getPoolVehicles = async (): Promise<PoolVehicle[]> => {
  try {
    const { data, error } = await supabase
      .from('pool_vehicles')
      .select(`
        *,
        currentBooking:vehicle_bookings(
          id,
          employee_id,
          employee_name,
          start_date,
          end_date,
          pin,
          status,
          created_at,
          updated_at
        )
      `)
      .order('registration');

    if (error) throw error;

    return data.map(vehicle => ({
      id: vehicle.id,
      registration: vehicle.registration,
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      status: vehicle.status,
      currentBooking: vehicle.currentBooking?.[0],
      notes: vehicle.notes
    }));
  } catch (error) {
    console.error('Error getting pool vehicles:', error);
    throw error;
  }
};

export const bookVehicle = async (booking: NewVehicleBooking): Promise<string> => {
  try {
    // First update vehicle status
    const { error: vehicleError } = await supabase
      .from('pool_vehicles')
      .update({ status: 'booked' })
      .eq('id', booking.vehicleId);

    if (vehicleError) throw vehicleError;

    // Then create booking
    const { data, error: bookingError } = await supabase
      .from('vehicle_bookings')
      .insert({
        vehicle_id: booking.vehicleId,
        employee_id: booking.employeeId,
        employee_name: booking.employeeName,
        start_date: booking.startDate,
        status: 'active'
      })
      .select()
      .single();

    if (bookingError) throw bookingError;

    // Generate and send PIN to employee's app
    // TODO: Implement PIN generation and notification

    return data.id;
  } catch (error) {
    console.error('Error booking vehicle:', error);
    throw error;
  }
};

export const returnVehicle = async (bookingId: string, pin: string): Promise<void> => {
  try {
    // Verify PIN
    const { data: booking, error: verifyError } = await supabase
      .from('vehicle_bookings')
      .select('vehicle_id, pin')
      .eq('id', bookingId)
      .single();

    if (verifyError) throw verifyError;
    if (booking.pin !== pin) throw new Error('Invalid PIN');

    // Update booking
    const { error: bookingError } = await supabase
      .from('vehicle_bookings')
      .update({
        end_date: new Date().toISOString(),
        status: 'completed'
      })
      .eq('id', bookingId);

    if (bookingError) throw bookingError;

    // Update vehicle status
    const { error: vehicleError } = await supabase
      .from('pool_vehicles')
      .update({ status: 'available' })
      .eq('id', booking.vehicle_id);

    if (vehicleError) throw vehicleError;
  } catch (error) {
    console.error('Error returning vehicle:', error);
    throw error;
  }
};