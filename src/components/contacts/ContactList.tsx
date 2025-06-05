import React, { useState, useEffect } from 'react';
import { Plus, Download, Upload, AlertTriangle, Trash2, Menu } from 'lucide-react';
import { Contact } from '../../types/contact';
import { getContacts, addBulkContacts, clearContacts } from '../../services/contactService';
import ContactTable from './ContactTable';
import NewContactModal from './NewContactModal';
import SearchBar from './SearchBar';
import { downloadCSV, parseCSV } from '../../utils/csv';
import { useAuth } from '../../contexts/AuthContext';

const ContactList: React.FC = () => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [showActions, setShowActions] = useState(false);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getContacts();
      setContacts(data);
    } catch (error: any) {
      setError(error.message || 'Failed to load contacts');
      console.error('Failed to load contacts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsLoading(true);
      setError(null);
      setUploadProgress(0);

      const progressInterval = setInterval(() => {
        setUploadProgress(prev => prev !== null && prev < 90 ? prev + 10 : prev);
      }, 200);

      const parsedContacts = await parseCSV(file);
      await addBulkContacts(parsedContacts);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      await loadContacts();
    } catch (error: any) {
      setError(error.message || 'Failed to upload CSV');
      console.error('Failed to upload CSV:', error);
    } finally {
      setIsLoading(false);
      setUploadProgress(null);
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const handleClearContacts = async () => {
    if (!window.confirm('Are you sure you want to clear all contacts? This action cannot be undone.')) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await clearContacts();
      setContacts([]);
      alert('All contacts have been cleared successfully.');
    } catch (error: any) {
      setError(error.message || 'Failed to clear contacts');
      console.error('Failed to clear contacts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const searchLower = searchQuery.toLowerCase();
    return (
      contact.name.toLowerCase().includes(searchLower) ||
      contact.company.toLowerCase().includes(searchLower) ||
      contact.email.toLowerCase().includes(searchLower) ||
      contact.department.toLowerCase().includes(searchLower)
    );
  });

  // Check if user has permission to see admin buttons
  const hasAdminAccess = user?.name?.toLowerCase() === 'leon' || user?.role === 'salesFreek';

  return (
    <div className="p-4 md:p-6 bg-blue-600 min-h-screen">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl md:text-2xl font-bold text-white">Contact List</h1>
          <button
            onClick={() => setShowActions(!showActions)}
            className="md:hidden text-white p-2"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
        
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="flex flex-col gap-4">
          <SearchBar 
            value={searchQuery}
            onChange={setSearchQuery}
          />

          <div className={`flex flex-col md:flex-row gap-2 ${showActions || 'md:flex hidden'}`}>
            {hasAdminAccess && (
              <>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="csv-upload"
                  disabled={isLoading}
                />
                <label
                  htmlFor="csv-upload"
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>{isLoading ? 'Uploading...' : 'Upload CSV'}</span>
                </label>
                <button
                  onClick={() => downloadCSV(contacts)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading || contacts.length === 0}
                >
                  <Download className="w-4 h-4" />
                  <span>Download CSV</span>
                </button>
                <button
                  onClick={handleClearContacts}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-white text-red-600 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading || contacts.length === 0}
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Clear All</span>
                </button>
              </>
            )}
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              disabled={isLoading}
            >
              <Plus className="w-4 h-4" />
              <span>Add Contact</span>
            </button>
          </div>
        </div>

        {uploadProgress !== null && (
          <div className="mt-4">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="mt-1 text-sm text-white text-right">{uploadProgress}%</p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        {isLoading && !uploadProgress ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <ContactTable contacts={filteredContacts} />
        )}
      </div>
      
      <NewContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onContactAdded={loadContacts}
      />
    </div>
  );
};

export default ContactList;