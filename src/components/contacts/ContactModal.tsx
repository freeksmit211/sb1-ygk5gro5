import React, { useState } from 'react';
import { X, Pencil } from 'lucide-react';
import { Contact } from '../../types/contact';
import { updateContact } from '../../services/contactService';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  contact: Contact;
  onContactUpdated: () => void;
  isEditing?: boolean;
}

const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  contact,
  onContactUpdated,
  isEditing: initialEditing = false
}) => {
  const [isEditing, setIsEditing] = useState(initialEditing);
  const [formData, setFormData] = useState({
    name: contact.name,
    company: contact.company,
    department: contact.department,
    email: contact.email,
    landline: contact.landline,
    cell: contact.cell,
    status: contact.status
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      setError(null);

      await updateContact(contact.id, formData);
      onContactUpdated();
      onClose();
    } catch (error: any) {
      console.error('Error updating contact:', error);
      setError(error.message || 'Failed to update contact');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl">
        <div className="px-6 py-4 bg-blue-600 flex justify-between items-center rounded-t-lg">
          <h3 className="text-xl font-bold text-white">
            {isEditing ? 'Edit Contact' : 'Contact Details'}
          </h3>
          <div className="flex items-center gap-4">
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-white hover:text-blue-100 flex items-center gap-2"
              >
                <Pencil className="w-5 h-5" />
                <span>Edit</span>
              </button>
            )}
            <button onClick={onClose} className="text-white hover:text-blue-100">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                  required
                  disabled={isSubmitting}
                />
              ) : (
                <p className="mt-1 text-gray-900">{contact.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Company</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                  required
                  disabled={isSubmitting}
                />
              ) : (
                <p className="mt-1 text-gray-900">{contact.company}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Department</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                  required
                  disabled={isSubmitting}
                />
              ) : (
                <p className="mt-1 text-gray-900">{contact.department}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                  required
                  disabled={isSubmitting}
                />
              ) : (
                <p className="mt-1 text-gray-900">{contact.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Landline</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={formData.landline}
                  onChange={(e) => setFormData(prev => ({ ...prev, landline: e.target.value }))}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                  disabled={isSubmitting}
                />
              ) : (
                <p className="mt-1 text-gray-900">{contact.landline || 'N/A'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Cell</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={formData.cell}
                  onChange={(e) => setFormData(prev => ({ ...prev, cell: e.target.value }))}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                  required
                  disabled={isSubmitting}
                />
              ) : (
                <p className="mt-1 text-gray-900">{contact.cell}</p>
              )}
            </div>

            {isEditing && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'active' | 'inactive' }))}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                  required
                  disabled={isSubmitting}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            )}
          </div>

          {isEditing && (
            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
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
          )}
        </form>
      </div>
    </div>
  );
};

export default ContactModal;