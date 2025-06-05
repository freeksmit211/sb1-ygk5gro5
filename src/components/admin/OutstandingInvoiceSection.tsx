import React, { useState } from 'react';
import { Receipt } from 'lucide-react';
import NewInvoiceModal from '../invoices/NewInvoiceModal';

const OutstandingInvoiceSection: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div 
        onClick={() => setIsModalOpen(true)}
        className="flex flex-col items-center justify-center rounded-lg bg-white p-6 shadow-sm transition-all hover:shadow-md cursor-pointer"
      >
        <Receipt className="h-8 w-8 text-blue-600 mb-3" />
        <h2 className="text-lg font-medium text-gray-900 text-center">Submit Outstanding Invoice</h2>
      </div>

      <NewInvoiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onInvoiceAdded={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default OutstandingInvoiceSection;