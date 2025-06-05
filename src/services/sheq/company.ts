import { supabase } from '../../lib/supabase';
import { Company, CompanyContact } from '../../types/sheq';
import { uploadFile } from './upload';

export const addCompany = async (
  companyData: Omit<Company, 'id' | 'documents' | 'personnel' | 'createdAt'>,
  documents: {
    safetyFile: File | null;
    medicals: File | null;
    inductions: File | null;
  },
  expiryDates: {
    safetyFile: string;
    medicals: string;
    inductions: string;
  }
): Promise<string> => {
  try {
    // Insert company first
    const { data: company, error: companyError } = await supabase
      .from('sheq_companies')
      .insert({
        name: companyData.name,
        contact_person: companyData.contactPerson,
        phone: companyData.phone,
        email: companyData.email
      })
      .select()
      .single();

    if (companyError) throw companyError;

    // Upload documents in parallel
    const uploadPromises = Object.entries(documents)
      .filter(([_, file]) => file !== null)
      .map(async ([type, file]) => {
        if (!file) return null;

        // Upload file to storage
        const filePath = `sheq/companies/${company.id}/${type}`;
        const fileUrl = await uploadFile(file, filePath);

        // Insert document record
        const { error: docError } = await supabase
          .from('sheq_documents')
          .insert({
            company_id: company.id,
            file_name: file.name,
            file_url: fileUrl,
            type,
            expiry_date: expiryDates[type as keyof typeof expiryDates]
          });

        if (docError) throw docError;
      });

    await Promise.all(uploadPromises);
    return company.id;
  } catch (error) {
    console.error('Error adding company:', error);
    throw error;
  }
};

export const getCompanies = async (): Promise<Company[]> => {
  try {
    const { data, error } = await supabase
      .from('sheq_companies')
      .select(`
        *,
        documents:sheq_documents(*),
        personnel:sheq_personnel(
          *,
          documents:sheq_personnel_documents(*)
        ),
        additionalContacts:sheq_company_contacts(*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(company => ({
      id: company.id,
      name: company.name,
      contactPerson: company.contact_person,
      phone: company.phone,
      email: company.email,
      createdAt: company.created_at,
      documents: company.documents.map((doc: any) => ({
        id: doc.id,
        fileUrl: doc.file_url,
        fileName: doc.file_name,
        type: doc.type,
        expiryDate: doc.expiry_date,
        uploadedAt: doc.uploaded_at
      })),
      personnel: company.personnel.map((person: any) => ({
        id: person.id,
        name: person.name,
        idNumber: person.id_number,
        position: person.position,
        contactNumber: person.contact_number,
        createdAt: person.created_at,
        documents: person.documents.map((doc: any) => ({
          id: doc.id,
          fileUrl: doc.file_url,
          fileName: doc.file_name,
          type: doc.type,
          expiryDate: doc.expiry_date,
          uploadedAt: doc.uploaded_at
        }))
      })),
      additionalContacts: company.additionalContacts.map((contact: any) => ({
        id: contact.id,
        name: contact.name,
        phone: contact.phone,
        email: contact.email,
        role: contact.role,
        createdAt: contact.created_at
      }))
    }));
  } catch (error) {
    console.error('Error getting companies:', error);
    throw error;
  }
};

export const getCompanyById = async (id: string): Promise<Company | null> => {
  try {
    const { data, error } = await supabase
      .from('sheq_companies')
      .select(`
        *,
        documents:sheq_documents(*),
        personnel:sheq_personnel(
          *,
          documents:sheq_personnel_documents(*)
        ),
        additionalContacts:sheq_company_contacts(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      contactPerson: data.contact_person,
      phone: data.phone,
      email: data.email,
      createdAt: data.created_at,
      documents: data.documents.map((doc: any) => ({
        id: doc.id,
        fileUrl: doc.file_url,
        fileName: doc.file_name,
        type: doc.type,
        expiryDate: doc.expiry_date,
        uploadedAt: doc.uploaded_at
      })),
      personnel: data.personnel.map((person: any) => ({
        id: person.id,
        name: person.name,
        idNumber: person.id_number,
        position: person.position,
        contactNumber: person.contact_number,
        createdAt: person.created_at,
        documents: person.documents.map((doc: any) => ({
          id: doc.id,
          fileUrl: doc.file_url,
          fileName: doc.file_name,
          type: doc.type,
          expiryDate: doc.expiry_date,
          uploadedAt: doc.uploaded_at
        }))
      })),
      additionalContacts: data.additionalContacts.map((contact: any) => ({
        id: contact.id,
        name: contact.name,
        phone: contact.phone,
        email: contact.email,
        role: contact.role,
        createdAt: contact.created_at
      }))
    };
  } catch (error) {
    console.error('Error getting company:', error);
    throw error;
  }
};

export const updateCompany = async (
  companyId: string,
  updates: {
    name: string;
    contactPerson: string;
    phone: string;
    email: string;
  }
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('sheq_companies')
      .update({
        name: updates.name,
        contact_person: updates.contactPerson,
        phone: updates.phone,
        email: updates.email,
        updated_at: new Date().toISOString()
      })
      .eq('id', companyId);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating company:', error);
    throw error;
  }
};

export const addCompanyContact = async (
  companyId: string,
  contact: Omit<CompanyContact, 'id' | 'createdAt'>
): Promise<string> => {
  try {
    const { data, error } = await supabase
      .from('sheq_company_contacts')
      .insert({
        company_id: companyId,
        name: contact.name,
        phone: contact.phone,
        email: contact.email,
        role: contact.role
      })
      .select()
      .single();

    if (error) throw error;
    return data.id;
  } catch (error) {
    console.error('Error adding company contact:', error);
    throw error;
  }
};

export const updateCompanyContact = async (
  contactId: string,
  updates: {
    name: string;
    phone: string;
    email: string;
    role: string;
  }
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('sheq_company_contacts')
      .update({
        name: updates.name,
        phone: updates.phone,
        email: updates.email,
        role: updates.role,
        updated_at: new Date().toISOString()
      })
      .eq('id', contactId);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating company contact:', error);
    throw error;
  }
};

export const deleteCompanyContact = async (contactId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('sheq_company_contacts')
      .delete()
      .eq('id', contactId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting company contact:', error);
    throw error;
  }
};