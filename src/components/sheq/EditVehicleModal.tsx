import React, { useState } from 'react';
import { X } from 'lucide-react';
import { DocumentUpload } from './DocumentUpload';
import { updateVehicle } from '../../services/sheqService';
import { Vehicle } from '../../types/sheq';

interface EditVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle;
  onVehicleUpdated: () => void;
}

const EditVehicleModal: React.FC<EditVehicleModalProps> = ({
  isOpen,
  onClose,
  vehicle,
  onVehicleUpdated
}) => {
  const [formData, setFormData] = useState({
    registration: vehicle.registration,
    make: vehicle.make,
    model: vehicle.model,
    year: vehicle.year
  });

  const [permitFile, setPermitFile] = useState<File | null>(null);
  const [permitExpiry, setPermitExpiry] = useState(
    vehicle.permit?.expiryDate ? new Date(vehicle.permit.expiryDate).toISOString().split('T')[0] : ''
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      setError(null);

      await updateVehicle(
        vehicle.id,
        formData,
        permitFile,
        permitFile ? permitExpiry : undefined
      );

      onVehicleUpdated();
      onClose();
    } catch (error) {
      console.error('Error updating vehicle:', error);
      setError('Failed to update vehicle. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="px-6 py-4 bg-blue-600 flex justify-between items-center rounded-t-lg">
          <h3 className="text-xl font-bold text-white">Edit Vehicle</h3>
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
            <label className="block text-sm font-medium text-gray-700">Registration</label>
            <input
              type="text"
              value={formData.registration}
              onChange={(e) => setFormData(prev => ({ ...prev, registration: e.target.value }))}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Make</label>
            <input
              type="text"
              value={formData.make}
              onChange={(e) => setFormData(prev => ({ ...prev, make: e.target.value }))}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Model</label>
            <input
              type="text"
              value={formData.model}
              onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Year</label>
            <input
              type="number"
              value={formData.year}
              onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
              required
              min="1900"
              max={new Date().getFullYear() + 1}
              disabled={isSubmitting}
            />
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium text-gray-900 mb-4">Vehicle Permit</h4>
            <DocumentUpload
              label="Permit Document"
              file={permitFile}
              expiryDate={permitExpiry}
              onFileChange={setPermitFile}
              onExpiryChange={setPermitExpiry}
              disabled={isSubmitting}
              type="permit"
            />
            {!permitFile && vehicle.permit && (
              <p className="mt-2 text-sm text-gray-500">
                Current permit expires on: {new Date(vehicle.permit.expiryDate).toLocaleDateString()}
              </p>
            )}
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
              {isSubmitting ? 'Updating...' : 'Update Vehicle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditVehicleModal;