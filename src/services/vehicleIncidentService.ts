import { supabase } from '../lib/supabase';
import { VehicleIncident, NewVehicleIncident } from '../types/vehicleIncident';

export const addVehicleIncident = async (incident: NewVehicleIncident): Promise<string> => {
  try {
    const { data, error } = await supabase
      .from('vehicle_incidents')
      .insert({
        date: incident.date,
        vehicle: incident.vehicle,
        driver: incident.driver,
        location: incident.location,
        description: incident.description,
        damage_photos: incident.damagePhotos,
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;
    return data.id;
  } catch (error) {
    console.error('Error adding vehicle incident:', error);
    throw error;
  }
};

export const getVehicleIncidents = async (): Promise<VehicleIncident[]> => {
  try {
    const { data, error } = await supabase
      .from('vehicle_incidents')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(incident => ({
      id: incident.id,
      date: incident.date,
      vehicle: incident.vehicle,
      driver: incident.driver,
      location: incident.location,
      description: incident.description,
      damagePhotos: incident.damage_photos,
      status: incident.status,
      createdAt: incident.created_at,
      updatedAt: incident.updated_at
    }));
  } catch (error) {
    console.error('Error getting vehicle incidents:', error);
    throw error;
  }
};

export const uploadIncidentPhoto = async (file: File, incidentId: string): Promise<string> => {
  try {
    const filePath = `vehicle-incidents/${incidentId}/${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading incident photo:', error);
    throw error;
  }
};