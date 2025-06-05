import { supabase } from '../../lib/supabase';
import { uploadFile } from './upload';

export const addVehicle = async (
  companyId: string,
  vehicleData: {
    registration: string;
    make: string;
    model: string;
    year: number;
  },
  permitFile: File,
  permitExpiryDate: string
): Promise<string> => {
  try {
    // Insert vehicle first
    const { data: vehicle, error: vehicleError } = await supabase
      .from('sheq_vehicles')
      .insert({
        company_id: companyId,
        registration: vehicleData.registration,
        make: vehicleData.make,
        model: vehicleData.model,
        year: vehicleData.year
      })
      .select()
      .single();

    if (vehicleError) throw vehicleError;

    // Upload permit file
    const filePath = `sheq/vehicles/${vehicle.id}/permit`;
    const fileUrl = await uploadFile(permitFile, filePath);

    // Add permit record
    const { error: permitError } = await supabase
      .from('sheq_vehicle_permits')
      .insert({
        vehicle_id: vehicle.id,
        file_name: permitFile.name,
        file_url: fileUrl,
        expiry_date: permitExpiryDate
      });

    if (permitError) throw permitError;

    return vehicle.id;
  } catch (error) {
    console.error('Error adding vehicle:', error);
    throw error;
  }
};

export const updateVehicle = async (
  vehicleId: string,
  updates: {
    registration?: string;
    make?: string;
    model?: string;
    year?: number;
  },
  newPermitFile?: File,
  newPermitExpiryDate?: string
): Promise<void> => {
  try {
    // Start a transaction
    const { error: vehicleError } = await supabase
      .from('sheq_vehicles')
      .update(updates)
      .eq('id', vehicleId);

    if (vehicleError) throw vehicleError;

    // Update permit if new file is provided
    if (newPermitFile && newPermitExpiryDate) {
      const filePath = `sheq/vehicles/${vehicleId}/permit`;
      const fileUrl = await uploadFile(newPermitFile, filePath);

      const { error: permitError } = await supabase
        .from('sheq_vehicle_permits')
        .upsert({
          vehicle_id: vehicleId,
          file_name: newPermitFile.name,
          file_url: fileUrl,
          expiry_date: newPermitExpiryDate
        });

      if (permitError) throw permitError;
    }
  } catch (error) {
    console.error('Error updating vehicle:', error);
    throw error;
  }
};

export const deleteVehicle = async (vehicleId: string): Promise<void> => {
  try {
    // Delete the vehicle - permits will be cascade deleted
    const { error } = await supabase
      .from('sheq_vehicles')
      .delete()
      .match({ id: vehicleId });

    if (error) {
      console.error('Database error:', error);
      throw new Error('Failed to delete vehicle');
    }

    // Attempt to delete storage files
    try {
      await supabase.storage
        .from('sheq')
        .remove([`vehicles/${vehicleId}`]);
    } catch (storageError) {
      // Log but don't throw - storage cleanup is best-effort
      console.warn('Failed to cleanup storage:', storageError);
    }
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    throw error;
  }
};

export const getVehiclesByCompany = async (companyId: string) => {
  try {
    const { data: vehicles, error: vehiclesError } = await supabase
      .from('sheq_vehicles')
      .select(`
        *,
        permit:sheq_vehicle_permits(
          id,
          file_url,
          file_name,
          expiry_date,
          uploaded_at
        )
      `)
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });

    if (vehiclesError) throw vehiclesError;

    return vehicles.map((vehicle: any) => ({
      id: vehicle.id,
      registration: vehicle.registration,
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      createdAt: vehicle.created_at,
      permit: vehicle.permit?.[0] ? {
        id: vehicle.permit[0].id,
        fileUrl: vehicle.permit[0].file_url,
        fileName: vehicle.permit[0].file_name,
        expiryDate: vehicle.permit[0].expiry_date,
        uploadedAt: vehicle.permit[0].uploaded_at
      } : undefined
    }));
  } catch (error) {
    console.error('Error getting vehicles:', error);
    throw error;
  }
};