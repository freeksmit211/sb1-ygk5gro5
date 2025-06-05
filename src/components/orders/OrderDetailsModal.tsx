import React, { useState, useEffect } from 'react';
import { X, MessageSquare, Calendar } from 'lucide-react';
import { Order } from '../../types/order';
import { OrderNote } from '../../types/order';
import { addOrderNote, getOrderNotes } from '../../services/orderNoteService';
import { updateOrderStatus } from '../../services/orderService';

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
  onOrderUpdated: () => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  isOpen,
  onClose,
  order,
  onOrderUpdated
}) => {
  const [notes, setNotes] = useState<OrderNote[]>([]);
  const [newNote, setNewNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(order.status);

  useEffect(() => {
    if (isOpen) {
      loadNotes();
    }
  }, [isOpen, order.id]);

  const loadNotes = async () => {
    try {
      setLoading(true);
      const orderNotes = await getOrderNotes(order.id);
      setNotes(orderNotes);
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
      await addOrderNote({
        orderId: order.id,
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

  const handleStatusChange = async (newStatus: string) => {
    try {
      setIsSubmitting(true);
      await updateOrderStatus(order.id, newStatus as Order['status']);
      setStatus(newStatus as Order['status']);
      onOrderUpdated();
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setIsSubmitting(false);
    }
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

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'new':
        return 'bg-yellow-100 text-yellow-800';
      case 'awaiting-approval':
        return 'bg-orange-100 text-orange-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'on-hold':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
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
          <h3 className="text-xl font-bold text-white">Order Details</h3>
          <button onClick={onClose} className="text-white hover:text-blue-100">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Order Number</p>
              <p className="text-lg text-gray-900">{order.orderNumber}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Customer</p>
              <p className="text-lg text-gray-900">{order.customer}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Responsible Person</p>
              <p className="text-lg text-gray-900">{order.responsiblePerson}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Lead Time</p>
              <p className="text-lg text-gray-900">
                {order.leadTime.minValue}-{order.leadTime.maxValue} {order.leadTime.unit}
              </p>
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
                <option value="in-progress">In Progress</option>
                <option value="on-hold">On Hold</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {order.notes && (
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-500">Notes</p>
              <p className="mt-1 text-gray-900 whitespace-pre-wrap">{order.notes}</p>
            </div>
          )}

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

export default OrderDetailsModal;