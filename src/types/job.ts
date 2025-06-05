export interface Job {
  id: string;
  title: string;
  description: string;
  jobDate: string;
  status: 'planned' | 'in-progress' | 'completed' | 'on-hold';
  priority: 'low' | 'medium' | 'high';
  assignedTo: string[];
  client: string;
  notes?: string;
  jobCardNumber?: string;
}

export type NewJob = Omit<Job, 'id'>;