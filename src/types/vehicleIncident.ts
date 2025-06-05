export interface VehicleIncident {
  id: string;
  date: string;
  vehicle: string;
  driver: string;
  location: string;
  description: string;
  damagePhotos: string[];
  status: 'pending' | 'reviewed' | 'resolved';
  createdAt: string;
  updatedAt: string;
}

export type NewVehicleIncident = Omit<VehicleIncident, 'id' | 'status' | 'createdAt' | 'updatedAt'>;