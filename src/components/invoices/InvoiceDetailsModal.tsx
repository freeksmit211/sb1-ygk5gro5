import React, { useState, useEffect } from 'react';
import { X, MessageSquare, Calendar, FileText, Download, AlertTriangle } from 'lucide-react';
import { Invoice } from '../../types/invoice';
import { InvoiceNote } from '../../types/invoiceNote';
import { addInvoiceNote, getInvoiceNotes } from '../../services/invoiceNoteService';
import DocumentUpload from './DocumentUpload';
import { updateInvoiceDocument, updateInvoiceStatus } from '../../services/invoiceService';

interface InvoiceDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice;
  onInvoiceUpdated?: () => void;
}

const InvoiceDetailsModal: React.FC<InvoiceDetailsModalProps> = ({
  isOpen,
  onClose,
  invoice,
  onInvoiceUpdated
}) => {
  const [notes, setNotes] = useState<InvoiceNote[]>([]);
  const [newNote, setNewNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showCompleteConfirm, setShowCompleteConfirm] = useState(false);
  const [status, setStatus] = useState(invoice.status);

  useEffect(() => {
    if (isOpen) {
      loadNotes();
    }
  }, [isOpen, invoice.id]);

  const loadNotes = async () => {
    try {
      setLoading(true);
      const invoiceNotes = await getInvoiceNotes(invoice.id);
      setNotes(invoiceNotes);
    } catch (error) {
      console.error('Failed to load notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    try {
      setIsSubmitting(true);
      await addInvoiceNote({
        invoiceId: invoice.id,
        note: newNote.trim()
      });
      await loadNotes();
      setNewNote('');
    } catch (error) {
      console.error('Failed to add note:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDocumentUpload = async (fileUrl: string) => {
    try {
      await updateInvoiceDocument(invoice.id, fileUrl);
      if (onInvoiceUpdated) {
        onInvoiceUpdated();
      }
    } catch (error) {
      console.error('Failed to update invoice document:', error);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      setIsSubmitting(true);
      await updateInvoiceStatus(invoice.id, newStatus as Invoice['status']);
      setStatus(newStatus as Invoice['status']);
      if (onInvoiceUpdated) {
        onInvoiceUpdated();
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleComplete = async () => {
    try {
      setIsSubmitting(true);
      await updateInvoiceStatus(invoice.id, 'paid');
      if (onInvoiceUpdated) {
        onInvoiceUpdated();
      }
      onClose();
    } catch (error) {
      console.error('Failed to complete invoice:', error);
      alert('Failed to complete invoice. Please try again.');
    } finally {
      setIsSubmitting(false);
      setShowCompleteConfirm(false);
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: Invoice['status']) => {
    switch (status) {
      case 'new':
        return 'bg-yellow-100 text-yellow-800';
      case 'awaiting-approval':
        return 'bg-orange-100 text-orange-800';
      case 'approved':
        return 'bg-blue-100 text-blue-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 bg-blue-600 flex justify-between items-center rounded-t-lg">
          <h3 className="text-xl font-bold text-white">Invoice Details</h3>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowCompleteConfirm(true)}
              className="px-4 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm font-medium"
              disabled={isSubmitting || status === 'paid'}
            >
              Complete
            </button>
            <button onClick={onClose} className="text-white hover:text-blue-100">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          {showCompleteConfirm && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-yellow-800 font-medium mb-4">
                Are you sure you want to mark this invoice as paid? This will remove it from the outstanding invoices list.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowCompleteConfirm(false)}
                  className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleComplete}
                  className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Completing...' : 'Yes, Complete'}
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Invoice Number</p>
              <p className="text-lg text-gray-900">{invoice.invoiceNumber}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Amount</p>
              <p className="text-lg text-gray-900">{formatCurrency(invoice.amount)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Customer</p>
              <p className="text-lg text-gray-900">{invoice.customerName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Company</p>
              <p className="text-lg text-gray-900">{invoice.company}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Due Date</p>
              <p className="text-lg text-gray-900">{formatDate(invoice.dueDate)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Status</p>
              <select
                value={status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                disabled={isSubmitting}
              >
                <option value="new">New</option>
                <option value="awaiting-approval">Awaiting Approval</option>
                <option value="approved">Approved</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-sm font-medium text-gray-500">Description</p>
            <p className="text-gray-900 whitespace-pre-wrap">{invoice.description}</p>
          </div>

          {/* Document Upload Section */}
          <div className="mb-6 border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Documents
              </h4>
              <DocumentUpload 
                invoiceId={invoice.id}
                onUploadComplete={handleDocumentUpload}
              />
            </div>
            
            {invoice.documentUrl ? (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Attached Document</span>
                  <a
                    href={invoice.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                  >
                    <Download className="w-4 h-4" />
                    <span className="text-sm">Download</span>
                  </a>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No documents attached</p>
            )}
          </div>

          <div className="border-t pt-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Notes
            </h4>

            <form onSubmit={handleSubmit} className="mb-6">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add a note..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                rows={3}
                required
                disabled={isSubmitting}
              />
              <div className="mt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSubmitting ? 'Adding...' : 'Add Note'}
                </button>
              </div>
            </form>

            {loading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {notes.map(note => (
                  <div key={note.id} className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-900 whitespace-pre-wrap">{note.note}</p>
                    <div className="mt-2 text-sm text-gray-500 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {formatDate(note.createdAt)}
                    </div>
                  </div>
                ))}
                {notes.length === 0 && (
                  <p className="text-center text-gray-500 py-4">No notes yet</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetailsModal;