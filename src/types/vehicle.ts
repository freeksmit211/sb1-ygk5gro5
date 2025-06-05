import { z } from 'zod';

export interface VehicleService {
  id: string;
  vehicle: string;
  serviceKm: number;
  nextServiceKm: number;
  notes?: string;
  createdAt: string;
}

export type NewVehicleService = Omit<VehicleService, 'id' | 'createdAt'>;

export interface VehicleBooking {
  id: string;
  vehicleId: string;
  employeeId: string;
  employeeName: string;
  startDate: string;
  endDate?: string;
  pin?: string;
  status: 'pending' | 'active' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export type NewVehicleBooking = Omit<VehicleBooking, 'id' | 'pin' | 'createdAt' | 'updatedAt'>;

export interface PoolVehicle {
  id: string;
  registration: string;
  make: string;
  model: string;
  year: number;
  status: 'available' | 'booked' | 'maintenance';
  currentBooking?: VehicleBooking;
  notes?: string;
}