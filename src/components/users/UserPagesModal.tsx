import React, { useState } from 'react';
import { X } from 'lucide-react';
import { User } from '../../types/user';
import { editUser } from '../../services/userService';

interface UserPagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onUserUpdated: () => void;
}

const AVAILABLE_PAGES = [
  { path: '/', label: 'Dashboard' },
  { path: '/management', label: 'Management' },
  { path: '/management/portal', label: 'Management Portal' },
  { path: '/sales', label: 'Sales' },
  { path: '/sales-accounts', label: 'Sales Accounts' },
  { path: '/sales-accounts/ytd', label: 'Sales Year to Date' },
  { path: '/sales-accounts/franco/ytd', label: 'Franco Year to Date' },
  { path: '/sales-accounts/freek/ytd', label: 'Freek Year to Date' },
  { path: '/sales-accounts/jeckie/ytd', label: 'Jeckie Year to Date' },
  { path: '/projects', label: 'Projects' },
  { path: '/admin', label: 'Admin' },
  { path: '/sheq', label: 'SHEQ' },
  { path: '/invoices', label: 'Invoices' },
  { path: '/notices', label: 'Notices' },
  { path: '/contacts', label: 'Contacts' },
  { path: '/deliveries', label: 'Deliveries' },
  { path: '/meetings', label: 'Meetings' },
  { path: '/forms', label: 'Forms' },
  { path: '/stock', label: 'Stock' },
  { path: '/todo/franco', label: 'Franco\'s Tasks' },
  { path: '/todo/freek', label: 'Freek\'s Tasks' },
  { path: '/todo/jeckie', label: 'Jeckie\'s Tasks' },
  { path: '/todo/sts', label: 'Project Tasks' },
  { path: '/whatsapp', label: 'WhatsApp' }
];

const UserPagesModal: React.FC<UserPagesModalProps> = ({
  isOpen,
  onClose,
  user,
  onUserUpdated
}) => {
  const [selectedPages, setSelectedPages] = useState<string[]>(user.allowed_pages || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      setError(null);

      await editUser(user.id, {
        allowed_pages: selectedPages
      });

      onUserUpdated();
      onClose();
    } catch (error: any) {
      console.error('Failed to update user pages:', error);
      setError(error.message || 'Failed to update user pages');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePageToggle = (page: string) => {
    setSelectedPages(prev => 
      prev.includes(page)
        ? prev.filter(p => p !== page)
        : [...prev, page]
    );
  };

  const handleSelectAll = () => {
    setSelectedPages(AVAILABLE_PAGES.map(p => p.path));
  };

  const handleDeselectAll = () => {
    setSelectedPages([]);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl">
        <div className="px-6 py-4 bg-blue-600 flex justify-between items-center rounded-t-lg">
          <h3 className="text-xl font-bold text-white">Edit User Pages - {user.name} {user.surname}</h3>
          <button onClick={onClose} className="text-white hover:text-blue-100">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="mb-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={handleSelectAll}
              className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg"
            >
              Select All
            </button>
            <button
              type="button"
              onClick={handleDeselectAll}
              className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg"
            >
              Deselect All
            </button>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {AVAILABLE_PAGES.map(({ path, label }) => (
                <label key={path} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedPages.includes(path)}
                    onChange={() => handlePageToggle(path)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserPagesModal;