export interface FreekActivity {
  id: string;
  date: string;
  description: string;
  type: 'meeting' | 'call' | 'quote' | 'order' | 'delivery';
  customerName: string;
  company: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}