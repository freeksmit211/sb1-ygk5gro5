export interface FrancoActivity {
  id: string;
  date: string;
  time: string;
  description: string;
  type: 'meeting' | 'call' | 'quote' | 'order' | 'delivery';
  customerName: string;
  company: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}