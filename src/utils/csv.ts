import { Contact } from '../types/contact';

export const downloadCSV = (contacts: Contact[]) => {
  const headers = ['name', 'company', 'department', 'email', 'landline', 'cell', 'status'];
  const csvContent = [
    headers.join(','),
    ...contacts.map(contact => 
      headers.map(header => {
        const value = contact[header as keyof Contact];
        return value ? `"${value}"` : '""';
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `contacts_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  window.URL.revokeObjectURL(url);
};

const mapHeaderToField = (header: string): string => {
  const headerMap: Record<string, string> = {
    'name': 'name',
    'fullname': 'name',
    'full name': 'name',
    'contact name': 'name',
    'company': 'company',
    'company name': 'company',
    'organization': 'company',
    'department': 'department',
    'dept': 'department',
    'email': 'email',
    'email address': 'email',
    'landline': 'landline',
    'telephone': 'landline',
    'phone': 'landline',
    'office phone': 'landline',
    'cell': 'cell',
    'mobile': 'cell',
    'cellphone': 'cell',
    'cell phone': 'cell',
    'mobile phone': 'cell',
    'status': 'status'
  };

  return headerMap[header.toLowerCase()] || header.toLowerCase();
};

export const parseCSV = async (file: File): Promise<Omit<Contact, 'id'>[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0);

        // Get and map headers
        const headers = lines[0].toLowerCase()
          .split(',')
          .map(h => h.trim().replace(/^"|"$/g, ''))
          .map(mapHeaderToField);

        const contacts = lines.slice(1).map(line => {
          // Split by comma but preserve commas in quotes
          const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
            .map(val => val.trim().replace(/^"|"$/g, ''));

          // Create contact with empty values
          const contact: any = {
            name: '',
            company: '',
            department: '',
            email: '',
            landline: '',
            cell: '',
            status: 'active'
          };
          
          // Map values to contact fields, only if they exist
          headers.forEach((header, index) => {
            if (header in contact && values[index]) {
              contact[header] = values[index].trim();
            }
          });

          // Only set required fields if they're empty
          if (!contact.name) return null;
          if (!contact.company) return null;

          return contact;
        }).filter(Boolean); // Remove null entries

        resolve(contacts);
      } catch (error: any) {
        reject(new Error(error.message || 'Failed to parse CSV file'));
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read CSV file'));
    reader.readAsText(file);
  });
};