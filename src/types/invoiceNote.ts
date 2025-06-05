export interface InvoiceNote {
  id: string;
  invoiceId: string;
  note: string;
  createdAt: string;
}

export type NewInvoiceNote = Omit<InvoiceNote, 'id' | 'createdAt'>;