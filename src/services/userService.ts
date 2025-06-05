import { supabase } from '../lib/supabase';
import { User, EditUserData } from '../types/user';

export const addUser = async (userData: Omit<User, 'id'>): Promise<string> => {
  try {
    // Validate required fields
    if (!userData.email || !userData.password || !userData.name || !userData.surname || !userData.role) {
      throw new Error('All required fields must be provided');
    }

    // First check if user exists
    const { data: existingUsers } = await supabase
      .from('users')
      .select('email')
      .eq('email', userData.email.toLowerCase())
      .maybeSingle();

    if (existingUsers) {
      throw new Error('A user with this email already exists');
    }

    // Create auth user first
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: userData.email.toLowerCase(),
      password: userData.password,
      email_confirm: true,
      user_metadata: {
        name: userData.name,
        surname: userData.surname,
        role: userData.role,
        allowed_pages: userData.allowed_pages
      }
    });

    if (authError) {
      console.error('Auth user creation error:', authError);
      throw new Error(authError.message);
    }

    if (!authData.user) {
      throw new Error('Failed to create auth user');
    }

    // The handle_new_user trigger will automatically create the public user record
    // We just need to wait a moment for the trigger to complete
    await new Promise(resolve => setTimeout(resolve, 1000));

    return authData.user.id;
  } catch (error: any) {
    console.error('Error adding user:', error);
    throw new Error(error.message || 'Failed to create user');
  }
};

export const editUser = async (userId: string, updates: EditUserData): Promise<void> => {
  try {
    // Update auth user metadata if name, role, or allowed_pages changes
    if (updates.name || updates.surname || updates.role || updates.allowed_pages) {
      const { error: metadataError } = await supabase.auth.updateUser({
        data: {
          name: updates.name,
          surname: updates.surname,
          role: updates.role,
          allowed_pages: updates.allowed_pages
        }
      });

      if (metadataError) throw metadataError;
    }

    // Update password if provided
    if (updates.password) {
      const { error: passwordError } = await supabase.auth.updateUser({
        password: updates.password
      });

      if (passwordError) throw passwordError;
    }

    // Update user record
    const { error } = await supabase
      .from('users')
      .update({
        ...(updates.name && { name: updates.name }),
        ...(updates.surname && { surname: updates.surname }),
        ...(updates.role && { role: updates.role }),
        ...(updates.allowed_pages && { allowed_pages: updates.allowed_pages }),
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) throw error;
  } catch (error: any) {
    console.error('Error updating user:', error);
    throw new Error(error.message || 'Failed to update user');
  }
};

export const deleteUser = async (userId: string): Promise<void> => {
  try {
    // First soft delete by updating role to 'deleted'
    const { error: updateError } = await supabase
      .from('users')
      .update({ role: 'deleted' })
      .eq('id', userId);

    if (updateError) throw updateError;

    // Then delete the auth user
    const { error: deleteError } = await supabase.auth.admin.deleteUser(userId);

    if (deleteError) throw deleteError;
  } catch (error: any) {
    console.error('Error deleting user:', error);
    throw new Error(error.message || 'Failed to delete user');
  }
};

export const getUsers = async (): Promise<User[]> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .neq('role', 'deleted') // Don't show deleted users
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return data.map(user => ({
      id: user.id,
      email: user.email,
      name: user.name,
      surname: user.surname,
      role: user.role,
      allowed_pages: user.allowed_pages
    }));
  } catch (error: any) {
    console.error('Error getting users:', error);
    throw new Error('Failed to get users');
  }
};