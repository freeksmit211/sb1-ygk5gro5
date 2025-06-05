import React, { useState } from 'react';
import { X } from 'lucide-react';
import { addOrder } from '../../services/orderService';
import { NewOrder, LeadTime } from '../../types/order';

interface NewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderAdded: () => void;
}

const NewOrderModal: React.FC<NewOrderModalProps> = ({
  isOpen,
  onClose,
  onOrderAdded
}) => {
  const [formData, setFormData] = useState<NewOrder>({
    orderNumber: '',
    customer: '',
    responsiblePerson: '',
    leadTime: {
      value: 1,
      unit: 'weeks',
      minValue: 1,
      maxValue: 1
    },
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
      await addOrder(formData);
      onOrderAdded();
      onClose();
    } catch (error: any) {
      console.error('Failed to add order:', error);
      setError(error.message || 'Failed to add order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLeadTimeChange = (field: keyof LeadTime, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      leadTime: {
        ...prev.leadTime,
        [field]: field === 'unit' ? value : Number(value)
      }
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="px-6 py-4 bg-blue-600 flex justify-between items-center rounded-t-lg">
          <h3 className="text-xl font-bold text-white">New Outstanding Order</h3>
          <button onClick={onClose} className="text-white hover:text-blue-100">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Order Number</label>
            <input
              type="text"
              value={formData.orderNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, orderNumber: e.target.value }))}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Customer</label>
            <input
              type="text"
              value={formData.customer}
              onChange={(e) => setFormData(prev => ({ ...prev, customer: e.target.value }))}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Responsible Person</label>
            <input
              type="text"
              value={formData.responsiblePerson}
              onChange={(e) => setFormData(prev => ({ ...prev, responsiblePerson: e.target.value }))}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Lead Time Range</label>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-gray-500">Min</label>
                <input
                  type="number"
                  value={formData.leadTime.minValue}
                  onChange={(e) => handleLeadTimeChange('minValue', e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                  required
                  min="1"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500">Max</label>
                <input
                  type="number"
                  value={formData.leadTime.maxValue}
                  onChange={(e) => handleLeadTimeChange('maxValue', e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                  required
                  min={formData.leadTime.minValue}
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500">Unit</label>
                <select
                  value={formData.leadTime.unit}
                  onChange={(e) => handleLeadTimeChange('unit', e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                  required
                  disabled={isSubmitting}
                >
                  <option value="weeks">Weeks</option>
                  <option value="days">Days</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
              rows={3}
              disabled={isSubmitting}
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
              {isSubmitting ? 'Adding...' : 'Add Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewOrderModal;