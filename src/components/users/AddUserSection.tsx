import React from 'react';
import { Plus, Users } from 'lucide-react';
import UserForm from './UserForm';
import UserList from './UserList';
import { addUser } from '../../services/userService';
import { User } from '../../types/user';

const AddUserSection: React.FC = () => {
  const [listKey, setListKey] = React.useState(0);

  const handleUserAdded = async (userData: Omit<User, 'id'>) => {
    try {
      await addUser(userData);
      setListKey(prev => prev + 1); // Force list refresh
    } catch (error) {
      console.error('Failed to add user:', error);
      throw error;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Users className="w-8 h-8 text-white" />
        <h1 className="text-2xl font-bold text-white">User Management</h1>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <Plus className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">Add User</h2>
        </div>
        <UserForm onSubmit={handleUserAdded} />
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">User List</h2>
        <UserList key={listKey} />
      </div>
    </div>
  );
};

export default AddUserSection;