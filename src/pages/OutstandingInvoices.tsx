import React, { useState, useEffect } from 'react';
import { Truck, Calendar, Package, FileText, Plus, Eye, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import NewInvoiceModal from '../components/invoices/NewInvoiceModal';
import InvoiceDetailsModal from '../components/invoices/InvoiceDetailsModal';
import { getInvoices } from '../services/invoiceService';
import { Invoice } from '../types/invoice';

const OutstandingInvoices: React.FC = () => {
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  const adminButtons = [
    { 
      title: 'Deliveries', 
      icon: Truck, 
      href: '/deliveries',
      active: false
    },
    { 
      title: 'Meetings', 
      icon: Calendar, 
      href: '/meetings',
      active: false
    },
    { 
      title: 'Stock Ready', 
      icon: Package, 
      href: '/stock',
      active: false
    },
    { 
      title: 'Items to be Repaired', 
      icon: Wrench, 
      href: '/repairs',
      active: false
    },
    { 
      title: 'Outstanding Invoices', 
      icon: FileText, 
      href: '/invoices',
      active: true
    }
  ];

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      const data = await getInvoices();
      setInvoices(data);
    } catch (error) {
      console.error('Failed to load invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="p-6">
      {/* Admin Navigation Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {adminButtons.map((button) => (
          <Link 
            key={button.title}
            to={button.href}
            className={`flex items-center gap-3 p-4 rounded-lg transition-all ${
              button.active 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'bg-white text-gray-900 hover:bg-gray-50'
            }`}
          >
            <button.icon className={`w-5 h-5 ${button.active ? 'text-white' : 'text-blue-600'}`} />
            <span className="font-medium">{button.title}</span>
          </Link>
        ))}
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Outstanding Invoices</h1>
        <button
          onClick={() => setIsNewModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          New Invoice
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : invoices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sales Rep
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {invoice.invoiceNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {invoice.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {invoice.company}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      {formatCurrency(invoice.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(invoice.dueDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        invoice.status === 'pending' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {invoice.salesRep || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button
                        onClick={() => setSelectedInvoice(invoice)}
                        className="text-blue-600 hover:text-blue-900 flex items-center gap-1 ml-auto"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No outstanding invoices found</p>
        )}
      </div>

      <NewInvoiceModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onInvoiceAdded={loadInvoices}
      />

      {selectedInvoice && (
        <InvoiceDetailsModal
          isOpen={true}
          onClose={() => setSelectedInvoice(null)}
          invoice={selectedInvoice}
          onInvoiceUpdated={loadInvoices}
        />
      )}
    </div>
  );
};

export default OutstandingInvoices;