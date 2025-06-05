import { supabase } from '../lib/supabase';
import { Invoice, NewInvoice } from '../types/invoice';

export const addInvoice = async (invoice: NewInvoice): Promise<string> => {
  try {
    const { data, error } = await supabase
      .from('outstanding_invoices')
      .insert({
        customer_name: invoice.customerName,
        company: invoice.company,
        invoice_number: invoice.invoiceNumber,
        amount: invoice.amount,
        due_date: invoice.dueDate,
        description: invoice.description,
        status: 'new'
      })
      .select()
      .single();

    if (error) throw error;
    return data.id;
  } catch (error) {
    console.error('Error adding invoice:', error);
    throw error;
  }
};

export const getInvoices = async (): Promise<Invoice[]> => {
  try {
    const { data, error } = await supabase
      .from('outstanding_invoices')
      .select(`
        *,
        documents:invoice_documents(*)
      `)
      .not('status', 'in', ('paid,cancelled'))
      .order('due_date', { ascending: true });

    if (error) throw error;

    return data.map(invoice => ({
      id: invoice.id,
      customerName: invoice.customer_name,
      company: invoice.company,
      invoiceNumber: invoice.invoice_number,
      amount: invoice.amount,
      dueDate: invoice.due_date,
      description: invoice.description,
      status: invoice.status,
      createdAt: invoice.created_at,
      documentUrl: invoice.documents?.[0]?.file_url
    }));
  } catch (error) {
    console.error('Error getting invoices:', error);
    throw error;
  }
};

export const updateInvoiceStatus = async (id: string, status: Invoice['status']): Promise<void> => {
  try {
    const { error } = await supabase
      .from('outstanding_invoices')
      .update({ status })
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating invoice status:', error);
    throw error;
  }
};

export const updateInvoiceDocument = async (id: string, documentUrl: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('invoice_documents')
      .insert({
        invoice_id: id,
        file_url: documentUrl,
        file_name: documentUrl.split('/').pop() || 'document',
        uploaded_by: (await supabase.auth.getUser()).data.user?.id
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error updating invoice document:', error);
    throw error;
  }
};