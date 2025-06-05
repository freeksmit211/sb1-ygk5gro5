import React, { useState } from 'react';
import { X } from 'lucide-react';
import { addStockItem } from '../../services/stockService';

interface AddStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStockAdded: () => void;
}

const AddStockModal: React.FC<AddStockModalProps> = ({
  isOpen,
  onClose,
  onStockAdded
}) => {
  const [formData, setFormData] = useState({
    itemName: '',
    quantity: '',
    clientName: '',
    clientCompany: '',
    assignedTo: '' as 'franco' | 'freek' | 'jeckie',
    notes: ''
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

      await addStockItem({
        itemName: formData.itemName,
        quantity: parseInt(formData.quantity),
        clientName: formData.clientName,
        clientCompany: formData.clientCompany,
        assignedTo: formData.assignedTo,
        notes: formData.notes
      });

      onStockAdded();
      onClose();
    } catch (error: any) {
      console.error('Failed to add stock item:', error);
      setError(error.message || 'Failed to add stock item. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="px-6 py-4 bg-blue-600 flex justify-between items-center rounded-t-lg">
          <h3 className="text-xl font-bold text-white">Add Stock Item</h3>
          <button onClick={onClose} className="text-white hover:text-blue-100">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Item Name</label>
            <input
              type="text"
              value={formData.itemName}
              onChange={(e) => setFormData(prev => ({ ...prev, itemName: e.target.value }))}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
              required
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Client Name</label>
            <input
              type="text"
              value={formData.clientName}
              onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Client Company</label>
            <input
              type="text"
              value={formData.clientCompany}
              onChange={(e) => setFormData(prev => ({ ...prev, clientCompany: e.target.value }))}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Assign To</label>
            <select
              value={formData.assignedTo}
              onChange={(e) => setFormData(prev => ({ ...prev, assignedTo: e.target.value as 'franco' | 'freek' | 'jeckie' }))}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
              required
            >
              <option value="">Select sales rep</option>
              <option value="franco">Franco</option>
              <option value="freek">Freek</option>
              <option value="jeckie">Jeckie</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
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
              {isSubmitting ? 'Adding...' : 'Add Stock Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStockModal;