export interface Contact {
  id: string;
  name: string;
  company: string;
  department: string;
  email: string;
  landline: string;
  cell: string;
  status: 'active' | 'inactive';
}