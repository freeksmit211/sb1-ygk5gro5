import React, { useState } from 'react';
import { Contact } from '../../types/contact';
import ContactModal from './ContactModal';
import { Pencil } from 'lucide-react';

interface ContactTableProps {
  contacts: Contact[];
}

const ContactTable: React.FC<ContactTableProps> = ({ contacts }) => {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleContactClick = (contact: Contact) => {
    setSelectedContact(contact);
    setIsEditing(false);
  };

  const handleEditClick = (e: React.MouseEvent, contact: Contact) => {
    e.stopPropagation(); // Prevent row click
    setSelectedContact(contact);
    setIsEditing(true);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Name</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Company</th>
            <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Department</th>
            <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Email</th>
            <th className="hidden lg:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Landline</th>
            <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Cell</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Status</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {contacts.map((contact) => (
            <tr 
              key={contact.id} 
              className="hover:bg-gray-50 cursor-pointer"
              onClick={() => handleContactClick(contact)}
            >
              <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{contact.name}</td>
              <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{contact.company}</td>
              <td className="hidden md:table-cell px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{contact.department}</td>
              <td className="hidden md:table-cell px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{contact.email}</td>
              <td className="hidden lg:table-cell px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{contact.landline}</td>
              <td className="hidden md:table-cell px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{contact.cell}</td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  contact.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {contact.status}
                </span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={(e) => handleEditClick(e, contact)}
                  className="text-blue-600 hover:text-blue-900 inline-flex items-center gap-1"
                >
                  <Pencil className="w-4 h-4" />
                  <span>Edit</span>
                </button>
              </td>
            </tr>
          ))}
          {contacts.length === 0 && (
            <tr>
              <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                No contacts found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {selectedContact && (
        <ContactModal
          isOpen={true}
          onClose={() => {
            setSelectedContact(null);
            setIsEditing(false);
          }}
          contact={selectedContact}
          onContactUpdated={() => {
            // Refresh contacts list
            window.location.reload();
          }}
          isEditing={isEditing}
        />
      )}
    </div>
  );
};

export default ContactTable;