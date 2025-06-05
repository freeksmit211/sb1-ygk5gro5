import { supabase } from '../supabase';
import { AuthResponse, SignInCredentials } from './types';

export const signIn = async ({ email, password }: SignInCredentials): Promise<AuthResponse> => {
  try {
    // Validate inputs before attempting sign in
    if (!email || !password) {
      return {
        user: null,
        error: {
          message: 'Email and password are required',
          status: 400
        }
      };
    }

    // First clear any existing session
    await signOut();

    // Special handling for Leon's email
    const isLeon = email.toLowerCase() === 'leon.venter@simotech.com';

    // Attempt sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password
    });

    if (error) {
      // Handle specific auth errors
      if (error.message.includes('Invalid login credentials')) {
        return {
          user: null,
          error: {
            message: 'Invalid email or password',
            status: 401
          }
        };
      }

      return {
        user: null,
        error: {
          message: error.message,
          status: error.status || 400
        }
      };
    }

    // Verify we have a valid session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return {
        user: null,
        error: {
          message: 'Failed to establish session',
          status: 500
        }
      };
    }

    // Get user data from public.users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (userError) {
      console.error('Error fetching user data:', userError);
      return {
        user: null,
        error: {
          message: 'Failed to fetch user data',
          status: 500
        }
      };
    }

    // Override role for Leon
    const role = isLeon ? 'superAdmin' : userData.role;

    // Update user role if needed for Leon
    if (isLeon && userData.role !== 'superAdmin') {
      const { error: updateError } = await supabase
        .from('users')
        .update({ role: 'superAdmin' })
        .eq('id', userData.id);

      if (updateError) {
        console.error('Error updating user role:', updateError);
      }
    }

    return {
      user: {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        role: role,
        allowed_pages: userData.allowed_pages
      },
      error: null
    };
  } catch (error: any) {
    console.error('Sign in error:', error);
    return {
      user: null,
      error: {
        message: 'An unexpected error occurred. Please try again.',
        status: error.status || 500
      }
    };
  }
};

export const signOut = async (): Promise<void> => {
  try {
    // Clear any stored data first
    localStorage.clear();
    sessionStorage.clear();
    
    // Then sign out
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error: any) {
    console.error('Sign out error:', error);
    // Even if there's an error, ensure we clear any local state
    localStorage.clear();
    sessionStorage.clear();
    await supabase.auth.signOut();
    throw error;
  }
};

export const refreshSession = async (): Promise<void> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    // Only attempt refresh if there's an existing session
    if (session) {
      const { error: refreshError } = await supabase.auth.refreshSession();
      if (refreshError) {
        // If refresh fails, clear everything
        await signOut();
        throw refreshError;
      }

      // Special handling for Leon after refresh
      if (session.user.email?.toLowerCase() === 'leon.venter@simotech.com') {
        const { error: updateError } = await supabase
          .from('users')
          .update({ role: 'superAdmin' })
          .eq('id', session.user.id);

        if (updateError) {
          console.error('Error updating user role after refresh:', updateError);
        }
      }
    } else {
      // No session exists, clear any stale data
      await signOut();
    }
  } catch (error) {
    console.error('Session refresh error:', error);
    // Clear everything on error
    await signOut();
    throw error;
  }
};