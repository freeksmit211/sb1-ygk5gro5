import { supabase } from '../../lib/supabase';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

export const uploadFile = async (file: File, path: string): Promise<string> => {
  try {
    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new Error('Invalid file type. Only PDF and Word documents are allowed.');
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('File size exceeds 10MB limit.');
    }

    // Extract bucket name from path (first segment)
    const [bucket, ...pathSegments] = path.split('/');
    if (!bucket) {
      throw new Error('Invalid storage path');
    }

    // Upload file
    const filePath = `${pathSegments.join('/')}/${Date.now()}_${file.name}`;
    const { error: uploadError, data } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};