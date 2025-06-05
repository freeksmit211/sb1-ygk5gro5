import { supabase } from '../../lib/supabase';
import { Personnel } from '../../types/sheq';
import { uploadFile } from './upload';

export const addPersonnel = async (
  companyId: string,
  personnelData: Omit<Personnel, 'id' | 'documents' | 'createdAt'>,
  documents: {
    medicals: File | null;
    inductions: File | null;
  },
  expiryDates: {
    medicals: string;
    inductions: string;
  }
): Promise<string> => {
  try {
    // Insert personnel first
    const { data: personnel, error: personnelError } = await supabase
      .from('sheq_personnel')
      .insert({
        company_id: companyId,
        name: personnelData.name,
        id_number: personnelData.idNumber,
        position: personnelData.position,
        contact_number: personnelData.contactNumber
      })
      .select()
      .single();

    if (personnelError) throw personnelError;

    // Upload documents in parallel
    const uploadPromises = Object.entries(documents)
      .filter(([_, file]) => file !== null)
      .map(async ([type, file]) => {
        if (!file) return null;

        // Upload file to storage
        const filePath = `sheq/personnel/${personnel.id}/${type}`;
        const fileUrl = await uploadFile(file, filePath);

        // Insert document record
        const { error: docError } = await supabase
          .from('sheq_personnel_documents')
          .insert({
            personnel_id: personnel.id,
            file_name: file.name,
            file_url: fileUrl,
            type, // Using 'type' instead of 'file_type'
            expiry_date: expiryDates[type as keyof typeof expiryDates]
          });

        if (docError) throw docError;
      });

    await Promise.all(uploadPromises);
    return personnel.id;
  } catch (error) {
    console.error('Error adding personnel:', error);
    throw error;
  }
};