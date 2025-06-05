import React from 'react';
import { X, Trash2 } from 'lucide-react';
import { User } from '../../types/user';
import UserForm from './UserForm';
import { editUser } from '../../services/userService';

interface UserModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onUserUpdated: () => void;
}

const UserModal: React.FC<UserModalProps> = ({
  user,
  isOpen,
  onClose,
  onUserUpdated
}) => {
  const [isDeleting, setIsDeleting] = React.useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (formData: Omit<User, 'id'>) => {
    try {
      await editUser(user.id, {
        name: formData.name,
        surname: formData.surname,
        role: formData.role,
        password: formData.password,
        allowed_pages: formData.allowed_pages
      });
      onUserUpdated();
      onClose();
    } catch (error) {
      console.error('Failed to update user:', error);
      alert('Failed to update user. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      setIsDeleting(true);
      await editUser(user.id, { role: 'deleted' }); // Soft delete by changing role
      onUserUpdated();
      onClose();
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert('Failed to delete user. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg w-full max-w-md my-8">
        <div className="sticky top-0 px-6 py-4 bg-blue-600 flex justify-between items-center rounded-t-lg z-10">
          <h3 className="text-xl font-bold text-white">Edit User</h3>
          <button onClick={onClose} className="text-white hover:text-blue-100">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
          <UserForm
            onSubmit={handleSubmit}
            initialData={{
              email: user.email,
              name: user.name,
              surname: user.surname,
              role: user.role,
              allowed_pages: user.allowed_pages
            }}
            isEditing={true}
          />
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-5 h-5" />
              {isDeleting ? 'Deleting...' : 'Delete User'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserModal;