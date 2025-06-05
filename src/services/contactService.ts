import { supabase } from '../lib/supabase';
import { Contact } from '../types/contact';

export const getContacts = async (): Promise<Contact[]> => {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;

    return data.map(contact => ({
      id: contact.id,
      name: contact.name,
      company: contact.company,
      department: contact.department || '',
      email: contact.email || 'no-email@example.com',
      landline: contact.landline || '',
      cell: contact.cell || '0000000000',
      status: contact.status
    }));
  } catch (error) {
    console.error('Error getting contacts:', error);
    throw error;
  }
};

export const addContact = async (contact: Omit<Contact, 'id'>): Promise<string> => {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .insert({
        name: contact.name,
        company: contact.company,
        department: contact.department || '',
        email: contact.email || 'no-email@example.com',
        landline: contact.landline || '',
        cell: contact.cell || '0000000000',
        status: contact.status
      })
      .select()
      .single();

    if (error) throw error;
    return data.id;
  } catch (error) {
    console.error('Error adding contact:', error);
    throw error;
  }
};

export const updateContact = async (id: string, contact: Partial<Contact>): Promise<void> => {
  try {
    const { error } = await supabase
      .from('contacts')
      .update({
        name: contact.name,
        company: contact.company,
        department: contact.department,
        email: contact.email,
        landline: contact.landline,
        cell: contact.cell,
        status: contact.status
      })
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating contact:', error);
    throw error;
  }
};

export const addBulkContacts = async (contacts: Omit<Contact, 'id'>[]): Promise<void> => {
  try {
    const { error } = await supabase
      .from('contacts')
      .insert(contacts.map(contact => ({
        name: contact.name,
        company: contact.company,
        department: contact.department || '',
        email: contact.email || 'no-email@example.com',
        landline: contact.landline || '',
        cell: contact.cell || '0000000000',
        status: contact.status
      })));

    if (error) throw error;
  } catch (error) {
    console.error('Error adding bulk contacts:', error);
    throw error;
  }
};

export const clearContacts = async (): Promise<void> => {
  try {
    const { error } = await supabase
      .from('contacts')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    if (error) throw error;
  } catch (error) {
    console.error('Error clearing contacts:', error);
    throw error;
  }
};