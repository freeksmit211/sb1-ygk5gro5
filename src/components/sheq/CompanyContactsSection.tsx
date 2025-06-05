import React, { useState } from 'react';
import { Plus, User, Phone, Mail, X, Pencil, Trash2, Building2, UserPlus } from 'lucide-react';
import { CompanyContact } from '../../types/sheq';
import { deleteCompanyContact } from '../../services/sheqService';
import { addContact } from '../../services/contactService';
import EditContactModal from './EditContactModal';

interface CompanyContactsSectionProps {
  companyId: string;
  primaryContact: {
    name: string;
    phone: string;
    email: string;
    department: string;
    landline: string;
    cell: string;
  };
  additionalContacts?: CompanyContact[];
  onAddContact: (contact: Omit<CompanyContact, 'id' | 'createdAt'>) => Promise<void>;
}

const CompanyContactsSection: React.FC<CompanyContactsSectionProps> = ({
  companyId,
  primaryContact,
  additionalContacts = [],
  onAddContact
}) => {
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [selectedContact, setSelectedContact] = useState<CompanyContact | null>(null);
  const [newContact, setNewContact] = useState({
    name: '',
    phone: '',
    email: '',
    role: '',
    department: '',
    landline: '',
    cell: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [addingToContactList, setAddingToContactList] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onAddContact(newContact);
      
      // Also add to main contact list if checkbox is checked
      if (addingToContactList === 'new') {
        await addContact({
          name: newContact.name,
          company: primaryContact.name,
          department: newContact.department || '',
          email: newContact.email,
          landline: newContact.landline || '',
          cell: newContact.cell,
          status: 'active'
        });
      }

      setNewContact({
        name: '',
        phone: '',
        email: '',
        role: '',
        department: '',
        landline: '',
        cell: ''
      });
      setIsAddingContact(false);
      setAddingToContactList(null);
    } catch (error) {
      console.error('Failed to add contact:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (contactId: string) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) {
      return;
    }

    try {
      setDeletingId(contactId);
      await deleteCompanyContact(contactId);
      await onAddContact(newContact); // Refresh the list
    } catch (error) {
      console.error('Failed to delete contact:', error);
      alert('Failed to delete contact. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleAddToContactList = async (contact: CompanyContact) => {
    try {
      setAddingToContactList(contact.id);
      await addContact({
        name: contact.name,
        company: primaryContact.name,
        department: contact.department || '',
        email: contact.email,
        landline: contact.landline || '',
        cell: contact.cell,
        status: 'active'
      });
      alert('Contact added to contact list successfully!');
    } catch (error) {
      console.error('Failed to add to contact list:', error);
      alert('Failed to add contact to contact list. Please try again.');
    } finally {
      setAddingToContactList(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Primary Contact */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
          <User className="w-5 h-5 text-gray-500" />
          <div>
            <p className="text-sm text-gray-500">Primary Contact</p>
            <p className="font-medium text-gray-900">{primaryContact.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
          <Building2 className="w-5 h-5 text-gray-500" />
          <div>
            <p className="text-sm text-gray-500">Department</p>
            <p className="font-medium text-gray-900">{primaryContact.department}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
          <Mail className="w-5 h-5 text-gray-500" />
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium text-gray-900">{primaryContact.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
          <Phone className="w-5 h-5 text-gray-500" />
          <div>
            <p className="text-sm text-gray-500">Cell</p>
            <p className="font-medium text-gray-900">{primaryContact.cell}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
          <Phone className="w-5 h-5 text-gray-500" />
          <div>
            <p className="text-sm text-gray-500">Landline</p>
            <p className="font-medium text-gray-900">{primaryContact.landline || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Additional Contacts */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Additional Contacts</h3>
          <button
            onClick={() => setIsAddingContact(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
          >
            <Plus className="w-4 h-4" />
            Add Contact
          </button>
        </div>

        {isAddingContact && (
          <form onSubmit={handleSubmit} className="mb-6 bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={newContact.name}
                  onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Department</label>
                <input
                  type="text"
                  value={newContact.department}
                  onChange={(e) => setNewContact(prev => ({ ...prev, department: e.target.value }))}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Cell</label>
                <input
                  type="tel"
                  value={newContact.cell}
                  onChange={(e) => setNewContact(prev => ({ ...prev, cell: e.target.value }))}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Landline</label>
                <input
                  type="tel"
                  value={newContact.landline}
                  onChange={(e) => setNewContact(prev => ({ ...prev, landline: e.target.value }))}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={newContact.email}
                  onChange={(e) => setNewContact(prev => ({ ...prev, email: e.target.value }))}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <input
                  type="text"
                  value={newContact.role}
                  onChange={(e) => setNewContact(prev => ({ ...prev, role: e.target.value }))}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                  required
                />
              </div>
            </div>

            {/* Add to Contact List Checkbox */}
            <div className="mb-4">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={addingToContactList === 'new'}
                  onChange={(e) => setAddingToContactList(e.target.checked ? 'new' : null)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  Also add to main contact list
                </span>
              </label>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsAddingContact(false);
                  setAddingToContactList(null);
                }}
                className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Adding...' : 'Add Contact'}
              </button>
            </div>
          </form>
        )}

        <div className="space-y-4">
          {additionalContacts.map(contact => (
            <div key={contact.id} className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">{contact.name}</p>
                    <p className="text-sm text-gray-500">{contact.role}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{contact.cell}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{contact.email}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAddToContactList(contact)}
                      className="p-1 text-green-600 hover:text-green-700 rounded-full hover:bg-green-50"
                      title="Add to contact list"
                      disabled={!!addingToContactList || !!deletingId}
                    >
                      {addingToContactList === contact.id ? (
                        <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <UserPlus className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => setSelectedContact(contact)}
                      className="p-1 text-blue-600 hover:text-blue-700 rounded-full hover:bg-blue-50"
                      title="Edit contact"
                      disabled={!!addingToContactList || !!deletingId}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(contact.id)}
                      className="p-1 text-red-600 hover:text-red-700 rounded-full hover:bg-red-50"
                      title="Delete contact"
                      disabled={!!addingToContactList || !!deletingId}
                    >
                      {deletingId === contact.id ? (
                        <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedContact && (
        <EditContactModal
          isOpen={true}
          onClose={() => setSelectedContact(null)}
          contact={selectedContact}
          onContactUpdated={() => {
            onAddContact(newContact); // Refresh the list
            setSelectedContact(null);
          }}
        />
      )}
    </div>
  );
};

export default CompanyContactsSection;