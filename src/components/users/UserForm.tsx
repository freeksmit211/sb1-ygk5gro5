import React, { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { User, UserRole, ROLE_LABELS } from '../../types/user';

interface UserFormProps {
  onSubmit: (user: Omit<User, 'id'>) => Promise<void>;
  initialData?: Partial<User>;
  isEditing?: boolean;
}

const UserForm: React.FC<UserFormProps> = ({ onSubmit, initialData, isEditing = false }) => {
  const [formData, setFormData] = useState({
    email: initialData?.email || '',
    role: initialData?.role || 'admin' as UserRole,
    name: initialData?.name || '',
    surname: initialData?.surname || '',
    password: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        email: initialData.email || prev.email,
        role: initialData.role || prev.role,
        name: initialData.name || prev.name,
        surname: initialData.surname || prev.surname
      }));
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      setError(null);

      // Validate required fields
      if (!formData.name.trim() || !formData.surname.trim()) {
        throw new Error('Please fill in all required fields');
      }

      // Validate email format
      const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Please enter a valid email address');
      }

      // Validate password for new users
      if (!isEditing && (!formData.password || formData.password.length < 6)) {
        throw new Error('Password must be at least 6 characters long');
      }

      await onSubmit(formData);
      
      if (!isEditing) {
        setFormData({ 
          email: '', 
          role: 'admin', 
          name: '', 
          surname: '', 
          password: ''
        });
      }
    } catch (error: any) {
      console.error('Form submission error:', error);
      setError(error.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">First Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
            required
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Surname</label>
          <input
            type="text"
            value={formData.surname}
            onChange={(e) => setFormData(prev => ({ ...prev, surname: e.target.value }))}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
            required
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
            required
            disabled={isEditing || isSubmitting}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
            required={!isEditing}
            minLength={6}
            placeholder={isEditing ? "Leave blank to keep current password" : ""}
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Role</label>
          <select
            value={formData.role}
            onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as UserRole }))}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
            disabled={isSubmitting}
          >
            {Object.entries(ROLE_LABELS).map(([role, label]) => (
              <option key={role} value={role}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              {isEditing ? 'Updating...' : 'Adding...'}
            </span>
          ) : (
            isEditing ? 'Update User' : 'Add User'
          )}
        </button>
      </div>
    </form>
  );
};

export default UserForm;