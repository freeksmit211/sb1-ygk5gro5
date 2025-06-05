import { z } from 'zod';

export type OrderStatus = 
  | 'new'
  | 'awaiting-approval'
  | 'in-progress'
  | 'on-hold'
  | 'completed'
  | 'cancelled';

export const orderStatusSchema = z.enum([
  'new',
  'awaiting-approval',
  'in-progress',
  'on-hold',
  'completed',
  'cancelled'
]);

export interface LeadTime {
  value: number;
  unit: 'weeks' | 'days';
  minValue: number;
  maxValue: number;
}

export interface OrderNote {
  id: string;
  orderId: string;
  note: string;
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  responsiblePerson: string;
  leadTime: LeadTime;
  createdAt: string;
  status: OrderStatus;
  notes?: string;
}

export type NewOrder = Omit<Order, 'id' | 'createdAt' | 'status'>;