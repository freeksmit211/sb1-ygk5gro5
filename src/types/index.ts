export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: 'active' | 'inactive' | 'lead';
  lastContact: string;
  notes: string;
}

export interface Deal {
  id: string;
  customerId: string;
  title: string;
  value: number;
  stage: 'lead' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  expectedCloseDate: string;
  probability: number;
  notes: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
  assignedTo: string;
  relatedTo?: {
    type: 'customer' | 'deal';
    id: string;
  };
}