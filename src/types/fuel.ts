import { z } from 'zod';

// Remove hardcoded sales rep codes
export const salesRepCodeSchema = z.string().regex(/^S0[0-9]+$/);
export type SalesRepCode = z.infer<typeof salesRepCodeSchema>;

export interface FuelEntry {
  id: string;
  date: string;
  slipNumber: string;
  vehicle: string;
  driver: string;
  driverName?: string;
  odometer: number;
  pumpReadingBefore: number;
  pumpReadingAfter: number;
  liters: number;
  allocatedTo?: string;
}