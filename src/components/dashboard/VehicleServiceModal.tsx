import React, { useState } from 'react';
import { X } from 'lucide-react';
import { addVehicleService } from '../../services/vehicleService';

interface VehicleServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: string | null;
  currentMileage: number;
  onServiceAdded: () => void;
}

const VehicleServiceModal: React.FC<VehicleServiceModalProps> = ({
  isOpen,
  onClose,
  vehicle,
  currentMileage,
  onServiceAdded
}) => {
  const [formData, setFormData] = useState({
    serviceKm: currentMileage,
    nextServiceKm: currentMileage + 10000,
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !vehicle) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      setError(null);

      await addVehicleService({
        vehicle,
        serviceKm: formData.serviceKm,
        nextServiceKm: formData.nextServiceKm,
        notes: formData.notes
      });

      onServiceAdded();
      onClose();
    } catch (error: any) {
      console.error('Failed to add service record:', error);
      setError(error.message || 'Failed to add service record. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="px-6 py-4 bg-blue-600 flex justify-between items-center rounded-t-lg">
          <h3 className="text-xl font-bold text-white">Update Service Info</h3>
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
            <label className="block text-sm font-medium text-gray-700">Vehicle</label>
            <input
              type="text"
              value={vehicle}
              disabled
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Current Mileage</label>
            <div className="mt-1 flex items-center gap-2">
              <input
                type="number"
                value={formData.serviceKm}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  serviceKm: parseInt(e.target.value),
                  nextServiceKm: parseInt(e.target.value) + 10000 // Auto-update next service
                }))}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2"
                required
                min={0}
                disabled={isSubmitting}
              />
              <span className="text-sm text-gray-500">km</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-700">Next Service Mileage</label>
              <span className="text-xs text-gray-500">Usually 10,000 km after current</span>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <input
                type="number"
                value={formData.nextServiceKm}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  nextServiceKm: parseInt(e.target.value)
                }))}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2"
                required
                min={formData.serviceKm + 1}
                disabled={isSubmitting}
              />
              <span className="text-sm text-gray-500">km</span>
            </div>
            {formData.nextServiceKm <= formData.serviceKm && (
              <p className="mt-1 text-sm text-red-600">
                Next service mileage must be greater than current mileage
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
              rows={3}
              placeholder="Enter any service notes or comments..."
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
              disabled={isSubmitting || formData.nextServiceKm <= formData.serviceKm}
            >
              {isSubmitting ? 'Saving...' : 'Save Service Info'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehicleServiceModal;