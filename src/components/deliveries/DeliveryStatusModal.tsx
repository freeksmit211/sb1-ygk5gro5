import React, { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';
import { Delivery } from '../../types/delivery';

interface DeliveryStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  delivery: Delivery;
  onMarkDelivered: (id: string, notes: string) => Promise<void>;
}

const DeliveryStatusModal: React.FC<DeliveryStatusModalProps> = ({
  isOpen,
  onClose,
  delivery,
  onMarkDelivered,
}) => {
  const [notes, setNotes] = useState(delivery.notes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleMarkDelivered = async () => {
    try {
      setIsSubmitting(true);
      await onMarkDelivered(delivery.id, notes);
    } catch (error) {
      console.error('Failed to mark as delivered:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="px-6 py-4 bg-blue-600 flex justify-between items-center rounded-t-lg">
          <h3 className="text-xl font-bold text-white">Delivery Details</h3>
          <button onClick={onClose} className="text-white hover:text-blue-100">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Company</p>
            <p className="text-lg text-gray-900">{delivery.company}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Area</p>
            <p className="text-lg text-gray-900">{delivery.area}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Vehicle</p>
            <p className="text-lg text-gray-900">{delivery.vehicle}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Driver</p>
            <p className="text-lg text-gray-900">{delivery.driver}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Item</p>
            <p className="text-lg text-gray-900">{delivery.item}</p>
          </div>
          {delivery.notes && (
            <div>
              <p className="text-sm font-medium text-gray-500">Delivery Notes</p>
              <p className="text-lg text-gray-900 whitespace-pre-wrap">{delivery.notes}</p>
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-gray-500">Status</p>
            <p className="text-lg text-gray-900 capitalize">{delivery.status}</p>
          </div>
          
          {delivery.status === 'pending' && (
            <>
              <div className="pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add Completion Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  rows={3}
                  placeholder="Enter any notes about the delivery completion..."
                />
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={handleMarkDelivered}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Mark as Delivered</span>
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeliveryStatusModal;