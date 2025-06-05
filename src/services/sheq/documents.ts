import { supabase } from '../../lib/supabase';
import { CompanyDocument } from '../../types/sheq';

export const updateCompanyDocument = async (
  companyId: string,
  documentId: string,
  updates: Partial<CompanyDocument>
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('sheq_documents')
      .update({
        file_name: updates.fileName,
        file_url: updates.fileUrl,
        file_type: updates.type,
        expiry_date: updates.expiryDate
      })
      .eq('id', documentId)
      .eq('company_id', companyId);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating document:', error);
    throw error;
  }
};