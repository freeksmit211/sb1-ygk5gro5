export type InvoiceStatus = 
  | 'new'
  | 'awaiting-approval'
  | 'approved'
  | 'paid'
  | 'overdue'
  | 'cancelled';

export interface Invoice {
  id: string;
  customerName: string;
  company: string;
  invoiceNumber: string;
  amount: number;
  dueDate: string;
  description: string;
  status: InvoiceStatus;
  createdAt: string;
  documentUrl?: string;
  updatedAt?: string;
  salesRep?: string;
}

export type NewInvoice = Omit<Invoice, 'id' | 'status' | 'createdAt' | 'documentUrl' | 'updatedAt'>;