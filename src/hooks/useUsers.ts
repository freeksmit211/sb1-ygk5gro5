import { useState, useCallback } from 'react';
import { addUser as addUserService } from '../services/userService';
import { User } from '../types/user';

export const useUsers = () => {
  const [error, setError] = useState<string | null>(null);

  const addUser = useCallback(async (userData: Omit<User, 'id'>) => {
    try {
      setError(null);
      await addUserService(userData);
    } catch (err) {
      setError('Failed to add user');
      throw err;
    }
  }, []);

  return {
    addUser,
    error
  };
};