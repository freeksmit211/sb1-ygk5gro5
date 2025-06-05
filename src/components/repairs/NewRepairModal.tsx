import React, { useState } from 'react';
import { X } from 'lucide-react';
import { addRepair } from '../../services/repairService';
import { NewRepair } from '../../types/repair';

interface NewRepairModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRepairAdded: () => void;
}

const NewRepairModal: React.FC<NewRepairModalProps> = ({
  isOpen,
  onClose,
  onRepairAdded
}) => {
  const [formData, setFormData] = useState<NewRepair>({
    customerName: '',
    jobNumber: '',
    serialNumber: '',
    status: 'new',
    itemDescription: '',
    repairDescription: ''
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
      await addRepair(formData);
      onRepairAdded();
      onClose();
    } catch (error: any) {
      console.error('Failed to add repair:', error);
      setError(error.message || 'Failed to add repair. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="px-6 py-4 bg-blue-600 flex justify-between items-center rounded-t-lg">
          <h3 className="text-xl font-bold text-white">New Repair</h3>
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
            <label className="block text-sm font-medium text-gray-700">Customer Name</label>
            <input
              type="text"
              value={formData.customerName}
              onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Job Number</label>
            <input
              type="text"
              value={formData.jobNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, jobNumber: e.target.value }))}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Serial Number</label>
            <input
              type="text"
              value={formData.serialNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, serialNumber: e.target.value }))}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Item Description</label>
            <textarea
              value={formData.itemDescription}
              onChange={(e) => setFormData(prev => ({ ...prev, itemDescription: e.target.value }))}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
              rows={3}
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Repair Description/Comments</label>
            <textarea
              value={formData.repairDescription}
              onChange={(e) => setFormData(prev => ({ ...prev, repairDescription: e.target.value }))}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
              rows={3}
              required
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
              {isSubmitting ? 'Adding...' : 'Add Repair'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewRepairModal;