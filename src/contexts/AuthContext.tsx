import React, { createContext, useContext, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../lib/auth/authStore';
import { AuthUser } from '../lib/auth/types';
import { refreshSession } from '../lib/auth/authService';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  refreshAuth: async () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading, setUser, setLoading } = useAuthStore();
  const mountedRef = useRef(true);

  const refreshAuth = async () => {
    if (!mountedRef.current) return;
    
    try {
      setLoading(true);
      
      // First try to refresh the session
      await refreshSession();
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Map email to correct role
        let role = session.user.user_metadata.role;
        if (session.user.email?.toLowerCase() === 'jeckie.mathibela@simotech.com') {
          role = 'salesJeckie';
        }

        if (mountedRef.current) {
          setUser({
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata.name,
            role: role,
            allowed_pages: session.user.user_metadata.allowed_pages
          });
        }
      } else {
        if (mountedRef.current) {
          setUser(null);
        }
      }
    } catch (error) {
      console.error('Auth refresh failed:', error);
      if (mountedRef.current) {
        setUser(null);
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    mountedRef.current = true;

    const initializeAuth = async () => {
      try {
        setLoading(true);
        
        // Get initial session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          try {
            // Try to refresh the session
            await refreshSession();
            
            // Only update state if component is still mounted
            if (mountedRef.current) {
              // Map email to correct role
              let role = session.user.user_metadata.role;
              if (session.user.email?.toLowerCase() === 'jeckie.mathibela@simotech.com') {
                role = 'salesJeckie';
              }

              setUser({
                id: session.user.id,
                email: session.user.email!,
                name: session.user.user_metadata.name,
                role: role,
                allowed_pages: session.user.user_metadata.allowed_pages
              });
            }
          } catch (refreshError) {
            console.error('Session refresh failed:', refreshError);
            if (mountedRef.current) {
              setUser(null);
            }
          }
        } else {
          if (mountedRef.current) {
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        if (mountedRef.current) {
          setUser(null);
        }
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    };

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mountedRef.current) return;

        setLoading(true);
        
        try {
          if (session?.user) {
            // Map email to correct role
            let role = session.user.user_metadata.role;
            if (session.user.email?.toLowerCase() === 'jeckie.mathibela@simotech.com') {
              role = 'salesJeckie';
            }

            setUser({
              id: session.user.id,
              email: session.user.email!,
              name: session.user.user_metadata.name,
              role: role,
              allowed_pages: session.user.user_metadata.allowed_pages
            });
          } else {
            setUser(null);
          }
        } catch (error) {
          console.error('Auth state change error:', error);
          setUser(null);
        } finally {
          setLoading(false);
        }
      }
    );

    // Initialize auth state
    initializeAuth();

    // Set up periodic session refresh
    const refreshInterval = setInterval(refreshAuth, 3600000); // Refresh every hour

    // Cleanup
    return () => {
      mountedRef.current = false;
      subscription.unsubscribe();
      clearInterval(refreshInterval);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, refreshAuth }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);