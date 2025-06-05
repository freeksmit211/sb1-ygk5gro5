import React, { useState, useEffect } from 'react';
import { X, Search, UserPlus } from 'lucide-react';
import { addCompany } from '../../services/sheqService';
import { DocumentUpload } from './DocumentUpload';
import { useNavigate } from 'react-router-dom';
import { getContacts, addContact } from '../../services/contactService';
import { Contact } from '../../types/contact';

interface AddCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompanyAdded: () => void;
}

const AddCompanyModal: React.FC<AddCompanyModalProps> = ({
  isOpen,
  onClose,
  onCompanyAdded
}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    department: '',
    landline: '',
    cell: ''
  });

  const [files, setFiles] = useState({
    safetyFile: null as File | null,
    medicals: null as File | null,
    inductions: null as File | null
  });

  const [expiryDates, setExpiryDates] = useState({
    safetyFile: '',
    medicals: '',
    inductions: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showContactList, setShowContactList] = useState(false);
  const [addingToContactList, setAddingToContactList] = useState(false);

  useEffect(() => {
    const loadContacts = async () => {
      try {
        const data = await getContacts();
        setContacts(data);
      } catch (error) {
        console.error('Failed to load contacts:', error);
      }
    };

    if (isOpen) {
      loadContacts();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Validate required files and expiry dates
    const requiredFiles = ['safetyFile', 'medicals', 'inductions'] as const;
    const missingFiles = requiredFiles.filter(type => !files[type]);
    const missingDates = requiredFiles.filter(type => !expiryDates[type]);

    if (missingFiles.length > 0 || missingDates.length > 0) {
      setError('All documents and expiry dates are required');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      // Add to contact list if checkbox is checked
      if (addingToContactList) {
        await addContact({
          name: formData.contactPerson,
          company: formData.name,
          department: formData.department,
          email: formData.email,
          landline: formData.landline,
          cell: formData.cell,
          status: 'active'
        });
      }

      const companyId = await addCompany({
        name: formData.name,
        contactPerson: formData.contactPerson,
        phone: formData.phone,
        email: formData.email,
        department: formData.department,
        landline: formData.landline,
        cell: formData.cell
      }, files, expiryDates);
      
      onCompanyAdded();
      onClose();

      // Navigate to the new company's details page
      navigate(`/sheq/company/${companyId}`);
    } catch (error) {
      console.error('Failed to add company:', error);
      setError('Failed to add company. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const searchLower = searchQuery.toLowerCase();
    return (
      contact.name.toLowerCase().includes(searchLower) ||
      contact.company.toLowerCase().includes(searchLower) ||
      contact.email.toLowerCase().includes(searchLower)
    );
  });

  const handleContactSelect = (contact: Contact) => {
    setFormData({
      ...formData,
      contactPerson: contact.name,
      department: contact.department,
      email: contact.email,
      landline: contact.landline || '',
      cell: contact.cell,
      phone: contact.cell // Set phone to cell for compatibility
    });
    setShowContactList(false);
    setSearchQuery('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center overflow-y-auto py-4">
      <div className="relative bg-white rounded-lg w-full max-w-md my-auto">
        <div className="sticky top-0 px-6 py-4 bg-blue-600 flex justify-between items-center rounded-t-lg z-10">
          <h3 className="text-xl font-bold text-white">Add New Company</h3>
          <button 
            onClick={onClose} 
            className="text-white hover:text-blue-100"
            disabled={isSubmitting}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Contact Search */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Contact List
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowContactList(true);
                }}
                onFocus={() => setShowContactList(true)}
                placeholder="Search contacts..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>

            {showContactList && searchQuery && (
              <div className="absolute z-20 mt-1 w-full max-h-60 overflow-auto bg-white border border-gray-200 rounded-lg shadow-lg">
                {filteredContacts.length > 0 ? (
                  filteredContacts.map(contact => (
                    <button
                      key={contact.id}
                      onClick={() => handleContactSelect(contact)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                    >
                      <div className="font-medium text-gray-900">{contact.name}</div>
                      <div className="text-sm text-gray-500">{contact.company}</div>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-2 text-sm text-gray-500">
                    No contacts found
                  </div>
                )}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Company Name</label>
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
              <label className="block text-sm font-medium text-gray-700">Contact Person</label>
              <input
                type="text"
                value={formData.contactPerson}
                onChange={(e) => setFormData(prev => ({ ...prev, contactPerson: e.target.value }))}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Department</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Cell</label>
                <input
                  type="tel"
                  value={formData.cell}
                  onChange={(e) => setFormData(prev => ({ ...prev, cell: e.target.value }))}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Landline</label>
                <input
                  type="tel"
                  value={formData.landline}
                  onChange={(e) => setFormData(prev => ({ ...prev, landline: e.target.value }))}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Add to Contact List Checkbox */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="addToContactList"
                checked={addingToContactList}
                onChange={(e) => setAddingToContactList(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label 
                htmlFor="addToContactList" 
                className="text-sm text-gray-700 flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                Add to Contact List
              </label>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-900 mb-4">Required Documents</h4>
              <div className="space-y-6">
                <DocumentUpload
                  label="Safety File"
                  file={files.safetyFile}
                  expiryDate={expiryDates.safetyFile}
                  onFileChange={(file) => setFiles(prev => ({ ...prev, safetyFile: file }))}
                  onExpiryChange={(date) => setExpiryDates(prev => ({ ...prev, safetyFile: date }))}
                  disabled={isSubmitting}
                  type="safety_documents"
                />
                <DocumentUpload
                  label="Medical Records"
                  file={files.medicals}
                  expiryDate={expiryDates.medicals}
                  onFileChange={(file) => setFiles(prev => ({ ...prev, medicals: file }))}
                  onExpiryChange={(date) => setExpiryDates(prev => ({ ...prev, medicals: date }))}
                  disabled={isSubmitting}
                  type="medicals"
                />
                <DocumentUpload
                  label="Induction Documents"
                  file={files.inductions}
                  expiryDate={expiryDates.inductions}
                  onFileChange={(file) => setFiles(prev => ({ ...prev, inductions: file }))}
                  onExpiryChange={(date) => setExpiryDates(prev => ({ ...prev, inductions: date }))}
                  disabled={isSubmitting}
                  type="inductions"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Adding...</span>
                  </>
                ) : (
                  'Add Company'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCompanyModal;