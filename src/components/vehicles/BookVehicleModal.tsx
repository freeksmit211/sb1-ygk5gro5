import React, { useState } from 'react';
import { X } from 'lucide-react';
import { PoolVehicle } from '../../types/vehicle';

interface BookVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: PoolVehicle;
  onBook: (vehicleId: string, employeeId: string) => Promise<void>;
  employees: string[];
}

const BookVehicleModal: React.FC<BookVehicleModalProps> = ({
  isOpen,
  onClose,
  vehicle,
  onBook,
  employees
}) => {
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployee || isSubmitting) return;

    try {
      setIsSubmitting(true);
      setError(null);
      await onBook(vehicle.id, selectedEmployee);
    } catch (error: any) {
      console.error('Failed to book vehicle:', error);
      setError(error.message || 'Failed to book vehicle. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="px-6 py-4 bg-blue-600 flex justify-between items-center rounded-t-lg">
          <h3 className="text-xl font-bold text-white">Book Vehicle</h3>
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
            <label className="block text-sm font-medium text-gray-700">Vehicle</label>
            <div className="mt-1 p-3 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-900">{vehicle.registration}</p>
              <p className="text-sm text-gray-600">{vehicle.make} {vehicle.model} ({vehicle.year})</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Employee</label>
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
              required
              disabled={isSubmitting}
            >
              <option value="">Select an employee</option>
              {employees.map(employee => (
                <option key={employee} value={employee}>
                  {employee}
                </option>
              ))}
            </select>
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
              disabled={isSubmitting || !selectedEmployee}
            >
              {isSubmitting ? 'Booking...' : 'Book Vehicle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookVehicleModal;