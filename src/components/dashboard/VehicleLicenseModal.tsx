import React, { useState, useEffect } from 'react';
import { X, Calendar } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface VehicleLicenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: string;
  expiryDate?: string;
  onUpdate: () => void;
  canManageLicenses: boolean;
}

const VehicleLicenseModal: React.FC<VehicleLicenseModalProps> = ({
  isOpen,
  onClose,
  vehicle,
  expiryDate,
  onUpdate,
  canManageLicenses
}) => {
  const [vehicles, setVehicles] = useState<string[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState(vehicle);
  const [newExpiryDate, setNewExpiryDate] = useState(
    expiryDate ? new Date(expiryDate).toISOString().split('T')[0] : ''
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && !vehicle) {
      loadAvailableVehicles();
    }
  }, [isOpen, vehicle]);

  const loadAvailableVehicles = async () => {
    try {
      const { data: licensedVehicles, error: licenseError } = await supabase
        .from('vehicle_licenses')
        .select('vehicle');

      if (licenseError) throw licenseError;

      const licensedSet = new Set(licensedVehicles.map(v => v.vehicle));

      const { data: allVehicles, error: vehicleError } = await supabase
        .from('vehicles')
        .select('registration')
        .eq('status', 'active');

      if (vehicleError) throw vehicleError;

      // Filter out vehicles that already have licenses
      const availableVehicles = allVehicles
        .map(v => v.registration)
        .filter(reg => !licensedSet.has(reg));

      setVehicles(availableVehicles);
    } catch (error) {
      console.error('Error loading vehicles:', error);
      setError('Failed to load available vehicles');
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManageLicenses) return;
    if (!selectedVehicle || !newExpiryDate) return;

    try {
      setIsSubmitting(true);
      setError(null);

      // First try to update existing license
      const { data: existingLicense, error: checkError } = await supabase
        .from('vehicle_licenses')
        .select('id')
        .eq('vehicle', selectedVehicle)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existingLicense) {
        // Update existing license
        const { error: updateError } = await supabase
          .from('vehicle_licenses')
          .update({
            expiry_date: new Date(newExpiryDate).toISOString(),
            renewal_reminder_sent: false,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingLicense.id);

        if (updateError) throw updateError;
      } else {
        // Insert new license
        const { error: insertError } = await supabase
          .from('vehicle_licenses')
          .insert({
            vehicle: selectedVehicle,
            expiry_date: new Date(newExpiryDate).toISOString(),
            renewal_reminder_sent: false
          });

        if (insertError) throw insertError;
      }

      onUpdate();
      onClose();
    } catch (error: any) {
      console.error('Error updating license:', error);
      setError(error.message || 'Failed to update license');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="px-6 py-4 bg-blue-600 flex justify-between items-center rounded-t-lg">
          <h3 className="text-xl font-bold text-white">Vehicle License Details</h3>
          <button onClick={onClose} className="text-white hover:text-blue-100">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Vehicle</label>
            {vehicle ? (
              <p className="mt-1 text-lg font-medium text-gray-900">{vehicle}</p>
            ) : (
              <select
                value={selectedVehicle}
                onChange={(e) => setSelectedVehicle(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                required
              >
                <option value="">Select a vehicle</option>
                {vehicles.map(reg => (
                  <option key={reg} value={reg}>{reg}</option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">License Expiry Date</label>
            <div className="mt-1 relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="date"
                value={newExpiryDate}
                onChange={(e) => setNewExpiryDate(e.target.value)}
                className="pl-10 block w-full rounded-lg border border-gray-300 px-3 py-2"
                required
                min={new Date().toISOString().split('T')[0]}
                disabled={!canManageLicenses}
              />
            </div>
          </div>

          {canManageLicenses && (
            <div className="flex justify-end gap-4 mt-6">
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
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default VehicleLicenseModal;