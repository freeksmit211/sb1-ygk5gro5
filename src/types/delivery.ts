export type DeliveryStatus = 'pending' | 'delivered';

export interface Delivery {
  id: string;
  date: string;
  area: string;
  company: string;
  vehicle: string;
  driver: string;
  item: string;
  notes?: string;
  status: DeliveryStatus;
}