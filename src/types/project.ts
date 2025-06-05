export interface Project {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'planned' | 'in-progress' | 'completed' | 'on-hold';
  priority: 'low' | 'medium' | 'high';
  assignedTo: string[];
  client: string;
  budget: number;
  notes?: string;
}

export type NewProject = Omit<Project, 'id'>;