import React, { useState } from 'react';
import { addStockItem } from '../../services/stockService';

interface StockSubmissionFormProps {
  onSubmit: () => void;
}

const SALES_REPS = [
  { id: 'franco', name: 'Franco' },
  { id: 'freek', name: 'Freek' },
  { id: 'jeckie', name: 'Jeckie' }
] as const;

const StockSubmissionForm: React.FC<StockSubmissionFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    itemName: '',
    quantity: '',
    clientName: '',
    clientCompany: '',
    assignedTo: '' as typeof SALES_REPS[number]['id'] | '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      await addStockItem({
        ...formData,
        assignedTo: formData.assignedTo as typeof SALES_REPS[number]['id'],
        quantity: parseInt(formData.quantity, 10)
      });
      setFormData({
        itemName: '',
        quantity: '',
        clientName: '',
        clientCompany: '',
        assignedTo: '',
        notes: ''
      });
      onSubmit();
    } catch (error) {
      console.error('Failed to submit stock:', error);
      alert('Failed to submit stock. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Item Name</label>
          <input
            type="text"
            value={formData.itemName}
            onChange={(e) => setFormData(prev => ({ ...prev, itemName: e.target.value }))}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
            required
            disabled={isSubmitting}
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
            disabled={isSubmitting}
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
            disabled={isSubmitting}
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
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Assign To</label>
          <select
            value={formData.assignedTo}
            onChange={(e) => setFormData(prev => ({ ...prev, assignedTo: e.target.value as typeof SALES_REPS[number]['id'] }))}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
            required
            disabled={isSubmitting}
          >
            <option value="">Select sales rep</option>
            {SALES_REPS.map(rep => (
              <option key={rep.id} value={rep.id}>{rep.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Notes</label>
          <input
            type="text"
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
            disabled={isSubmitting}
          />
        </div>
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Stock'}
        </button>
      </div>
    </form>
  );
};

export default StockSubmissionForm;