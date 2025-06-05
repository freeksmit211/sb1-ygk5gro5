import React, { useState } from 'react';
import { X } from 'lucide-react';
import { addDelivery } from '../../services/deliveryService';
import { DeliveryStatus } from '../../types/delivery';

interface DeliveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date;
  onDeliveryAdded: () => void;
}

const DeliveryModal: React.FC<DeliveryModalProps> = ({
  isOpen,
  onClose,
  date,
  onDeliveryAdded
}) => {
  const [formData, setFormData] = useState({
    area: '',
    company: '',
    vehicle: '',
    driver: '',
    item: '',
    notes: '',
    status: 'pending' as DeliveryStatus
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDelivery({
        ...formData,
        date: date.toISOString(),
      });
      onDeliveryAdded();
      onClose();
    } catch (error) {
      console.error('Failed to add delivery:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="px-6 py-4 bg-blue-600 flex justify-between items-center">
          <h3 className="text-xl font-bold text-white">
            Schedule Delivery for {date.toLocaleDateString()}
          </h3>
          <button onClick={onClose} className="text-white hover:text-blue-100">
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Area</label>
            <input
              type="text"
              value={formData.area}
              onChange={(e) => setFormData(prev => ({ ...prev, area: e.target.value }))}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Company</label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Vehicle</label>
            <input
              type="text"
              value={formData.vehicle}
              onChange={(e) => setFormData(prev => ({ ...prev, vehicle: e.target.value }))}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Driver</label>
            <input
              type="text"
              value={formData.driver}
              onChange={(e) => setFormData(prev => ({ ...prev, driver: e.target.value }))}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Item</label>
            <input
              type="text"
              value={formData.item}
              onChange={(e) => setFormData(prev => ({ ...prev, item: e.target.value }))}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
              rows={3}
              placeholder="Add any special instructions or notes for this delivery..."
            />
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Schedule Delivery
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeliveryModal;