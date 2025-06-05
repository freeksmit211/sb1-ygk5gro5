import { supabase } from '../lib/supabase';
import { VehicleInspection, NewVehicleInspection } from '../types/vehicleInspection';

export const uploadDamagePhoto = async (file: File, inspectionId: string): Promise<string> => {
  try {
    const filePath = `vehicle-inspections/${inspectionId}/${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading damage photo:', error);
    throw error;
  }
};

export const addVehicleInspection = async (inspection: NewVehicleInspection): Promise<string> => {
  try {
    const { data, error } = await supabase
      .from('vehicle_inspections')
      .insert({
        date: inspection.date,
        vehicle: inspection.vehicle,
        driver: inspection.driver,
        mileage: inspection.mileage,
        items: inspection.items,
        notes: inspection.notes,
        damage_photos: inspection.damagePhotos || []
      })
      .select()
      .single();

    if (error) throw error;
    return data.id;
  } catch (error) {
    console.error('Error adding vehicle inspection:', error);
    throw error;
  }
};

export const getVehicleInspections = async (): Promise<VehicleInspection[]> => {
  try {
    const { data, error } = await supabase
      .from('vehicle_inspections')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(inspection => ({
      id: inspection.id,
      date: inspection.date,
      vehicle: inspection.vehicle,
      driver: inspection.driver,
      mileage: inspection.mileage,
      items: inspection.items,
      notes: inspection.notes,
      damagePhotos: inspection.damage_photos || [],
      createdAt: inspection.created_at
    }));
  } catch (error) {
    console.error('Error getting vehicle inspections:', error);
    throw error;
  }
};