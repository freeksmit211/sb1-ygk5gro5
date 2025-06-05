import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, AlertTriangle, X, Calendar } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { getVehicleLicenses, updateVehicleLicense } from '../../services/vehicleService';

interface Vehicle {
  id: string;
  registration: string;
  make: string;
  model: string;
  year: number;
  status: 'active' | 'maintenance' | 'retired';
  notes?: string;
  license?: {
    expiryDate: string;
    renewalReminderSent: boolean;
  };
}

interface VehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle?: Vehicle | null;
  onSave: () => Promise<void>;
}

const VehicleModal: React.FC<VehicleModalProps> = ({ isOpen, onClose, vehicle, onSave }) => {
  const [formData, setFormData] = useState({
    registration: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    status: 'active' as const,
    notes: '',
    licenseExpiryDate: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (vehicle) {
      // Preserve existing vehicle data when editing
      setFormData({
        registration: vehicle.registration,
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        status: vehicle.status,
        notes: vehicle.notes || '',
        licenseExpiryDate: vehicle.license?.expiryDate || ''
      });
    } else {
      // Reset form for new vehicle
      setFormData({
        registration: '',
        make: '',
        model: '',
        year: new Date().getFullYear(),
        status: 'active',
        notes: '',
        licenseExpiryDate: ''
      });
    }
  }, [vehicle]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      setError(null);

      // Validate registration format
      const registrationRegex = /^[A-Z]{3} [0-9]{3} MP$/;
      if (!registrationRegex.test(formData.registration)) {
        setError('Registration must be in the format "XXX 000 MP"');
        return;
      }

      if (vehicle) {
        // Update existing vehicle
        const { error: updateError } = await supabase
          .from('vehicles')
          .update({
            registration: formData.registration.toUpperCase(),
            make: formData.make,
            model: formData.model,
            year: formData.year,
            status: formData.status,
            notes: formData.notes || null
          })
          .eq('id', vehicle.id);

        if (updateError) throw updateError;
      } else {
        // Add new vehicle
        const { error: insertError } = await supabase
          .from('vehicles')
          .insert({
            registration: formData.registration.toUpperCase(),
            make: formData.make,
            model: formData.model,
            year: formData.year,
            status: formData.status,
            notes: formData.notes || null
          })
          .select()
          .single();

        if (insertError) {
          if (insertError.code === '23505') {
            setError('A vehicle with this registration already exists');
            return;
          }
          throw insertError;
        }
      }

      // Update license if expiry date is provided
      if (formData.licenseExpiryDate) {
        await updateVehicleLicense(formData.registration.toUpperCase(), formData.licenseExpiryDate);
      }
      
      await onSave();
      onClose();
    } catch (error: any) {
      console.error('Failed to save vehicle:', error);
      setError(error.message || 'Failed to save vehicle. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="px-6 py-4 bg-blue-600 flex justify-between items-center rounded-t-lg">
          <h3 className="text-xl font-bold text-white">
            {vehicle ? 'Edit Vehicle' : 'Add Vehicle'}
          </h3>
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
              onChange={(e) => setFormData(prev => ({ ...prev, registration: e.target.value.toUpperCase() }))}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
              placeholder="XXX 000 MP"
              required
              pattern="^[A-Z]{3} [0-9]{3} MP$"
              title="Format: XXX 000 MP (e.g., ABC 123 MP)"
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
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'active' | 'maintenance' | 'retired' }))}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
              required
            >
              <option value="active">Active</option>
              <option value="maintenance">Maintenance</option>
              <option value="retired">Retired</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">License Expiry Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="date"
                value={formData.licenseExpiryDate}
                onChange={(e) => setFormData(prev => ({ ...prev, licenseExpiryDate: e.target.value }))}
                className="pl-10 mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
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
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              {vehicle ? 'Update Vehicle' : 'Add Vehicle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const VehicleRegister: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadVehicles = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get vehicles with all fields
      const { data: vehiclesData, error: vehiclesError } = await supabase
        .from('vehicles')
        .select('*')
        .order('registration', { ascending: true });

      if (vehiclesError) throw vehiclesError;

      // Get licenses
      const { data: licensesData, error: licensesError } = await supabase
        .from('vehicle_licenses')
        .select('*');

      if (licensesError) throw licensesError;

      // Combine vehicle and license data
      const vehiclesWithLicenses = vehiclesData.map(vehicle => ({
        ...vehicle,
        license: licensesData?.find(license => license.vehicle === vehicle.registration)
          ? {
              expiryDate: licensesData.find(license => license.vehicle === vehicle.registration)!.expiry_date,
              renewalReminderSent: licensesData.find(license => license.vehicle === vehicle.registration)!.renewal_reminder_sent
            }
          : undefined
      }));

      setVehicles(vehiclesWithLicenses);
    } catch (error: any) {
      console.error('Error loading vehicles:', error);
      setError('Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this vehicle? This action cannot be undone.')) {
      return;
    }

    try {
      setDeletingId(id);
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadVehicles();
    } catch (error: any) {
      console.error('Failed to delete vehicle:', error);
      alert('Failed to delete vehicle. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const getLicenseStatus = (expiryDate?: string) => {
    if (!expiryDate) return { color: 'bg-gray-100 text-gray-800', text: 'No License' };
    
    const days = Math.ceil(
      (new Date(expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (days < 0) return { color: 'bg-red-100 text-red-800', text: 'Expired' };
    if (days <= 30) return { color: 'bg-yellow-100 text-yellow-800', text: `Expires in ${days} days` };
    return { color: 'bg-green-100 text-green-800', text: 'Valid' };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Vehicle Register</h2>
        <button
          onClick={() => {
            setSelectedVehicle(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Vehicle
        </button>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-lg">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Registration
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Make
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Model
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Year
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                License Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {vehicles.map((vehicle) => {
              const licenseStatus = getLicenseStatus(vehicle.license?.expiryDate);
              return (
                <tr key={vehicle.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {vehicle.registration}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {vehicle.make}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {vehicle.model}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {vehicle.year}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      vehicle.status === 'active' 
                        ? 'bg-green-100 text-green-800'
                        : vehicle.status === 'maintenance'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {vehicle.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${licenseStatus.color}`}>
                      {licenseStatus.text}
                    </span>
                    {vehicle.license?.expiryDate && (
                      <div className="text-xs text-gray-500 mt-1">
                        Expires: {new Date(vehicle.license.expiryDate).toLocaleDateString()}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setSelectedVehicle(vehicle);
                          setIsModalOpen(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(vehicle.id)}
                        className="text-red-600 hover:text-red-900"
                        disabled={!!deletingId}
                      >
                        {deletingId === vehicle.id ? (
                          <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {vehicles.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                  No vehicles found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <VehicleModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedVehicle(null);
        }}
        vehicle={selectedVehicle}
        onSave={loadVehicles}
      />
    </div>
  );
};

export default VehicleRegister;