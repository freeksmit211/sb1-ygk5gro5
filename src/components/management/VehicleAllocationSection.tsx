import React, { useState, useEffect } from 'react';
import { Car, AlertTriangle, Pencil, Trash2, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface VehicleAllocation {
  id: string;
  rep_code: string;
  vehicle: string;
  start_date: string;
  end_date: string | null;
}

interface SalesRep {
  id: string;
  code: string;
  name: string;
}

interface Vehicle {
  registration: string;
  make: string;
  model: string;
  year: number;
}

const VehicleAllocationSection: React.FC = () => {
  const [allocations, setAllocations] = useState<VehicleAllocation[]>([]);
  const [salesReps, setSalesReps] = useState<SalesRep[]>([]);
  const [vehicles, setVehicles] = useState<Record<string, Vehicle>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAllocation, setSelectedAllocation] = useState<VehicleAllocation | null>(null);
  const [editMode, setEditMode] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load sales reps, allocations, and vehicles in parallel
      const [repsResponse, allocationsResponse, vehiclesResponse] = await Promise.all([
        supabase
          .from('sales_rep_allocations')
          .select('*')
          .order('code'),
        supabase
          .from('sales_rep_vehicle_allocations')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('vehicles')
          .select('registration, make, model, year')
          .eq('status', 'active')
      ]);

      if (repsResponse.error) throw repsResponse.error;
      if (allocationsResponse.error) throw allocationsResponse.error;
      if (vehiclesResponse.error) throw vehiclesResponse.error;

      setSalesReps(repsResponse.data || []);
      setAllocations(allocationsResponse.data || []);

      // Create a map of vehicle details
      const vehicleMap: Record<string, Vehicle> = {};
      vehiclesResponse.data?.forEach(vehicle => {
        vehicleMap[vehicle.registration] = vehicle;
      });
      setVehicles(vehicleMap);
    } catch (error: any) {
      console.error('Error loading data:', error);
      setError(error.message || 'Failed to load vehicle allocations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAllocationChange = async (repCode: string, vehicle: string) => {
    if (!vehicle) return;

    try {
      setSaving(true);
      setError(null);

      // End current allocation for this rep if exists
      const currentRepAllocation = allocations.find(
        a => a.rep_code === repCode && !a.end_date
      );

      if (currentRepAllocation) {
        const { error: endRepError } = await supabase
          .from('sales_rep_vehicle_allocations')
          .update({ end_date: new Date().toISOString() })
          .eq('id', currentRepAllocation.id);

        if (endRepError) throw endRepError;
      }

      // End current allocation for this vehicle if exists
      const currentVehicleAllocation = allocations.find(
        a => a.vehicle === vehicle && !a.end_date
      );

      if (currentVehicleAllocation) {
        const { error: endVehicleError } = await supabase
          .from('sales_rep_vehicle_allocations')
          .update({ end_date: new Date().toISOString() })
          .eq('id', currentVehicleAllocation.id);

        if (endVehicleError) throw endVehicleError;
      }

      // Create new allocation
      const { error: createError } = await supabase
        .from('sales_rep_vehicle_allocations')
        .insert({
          rep_code: repCode,
          vehicle: vehicle,
          start_date: new Date().toISOString()
        });

      if (createError) throw createError;

      await loadData();
    } catch (error: any) {
      console.error('Error updating allocation:', error);
      setError('Failed to update vehicle allocation');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateAllocation = async (allocation: VehicleAllocation) => {
    try {
      setSaving(true);
      setError(null);

      const { error } = await supabase
        .from('sales_rep_vehicle_allocations')
        .update({
          end_date: allocation.end_date
        })
        .eq('id', allocation.id);

      if (error) throw error;

      await loadData();
      setSelectedAllocation(null);
      setEditMode(false);
    } catch (error: any) {
      console.error('Error updating allocation:', error);
      setError('Failed to update allocation');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAllocation = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this allocation?')) {
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const { error } = await supabase
        .from('sales_rep_vehicle_allocations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await loadData();
      setSelectedAllocation(null);
    } catch (error: any) {
      console.error('Error deleting allocation:', error);
      setError('Failed to delete allocation');
    } finally {
      setSaving(false);
    }
  };

  const getCurrentVehicle = (repCode: string) => {
    const currentAllocation = allocations.find(
      a => a.rep_code === repCode && !a.end_date
    );
    return currentAllocation?.vehicle || '';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg md:text-xl font-bold bg-gray-100 text-gray-800 mb-4 p-4 rounded-lg flex items-center gap-2">
        <Car className="w-6 h-6" />
        Vehicle Allocation
      </h2>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          <p>{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="space-y-6">
          {salesReps.map(rep => (
            <div key={rep.id} className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="w-full md:w-48">
                <span className="text-lg font-semibold text-gray-900">
                  {rep.name} ({rep.code})
                </span>
              </div>
              <div className="flex-1">
                <select
                  value={getCurrentVehicle(rep.code)}
                  onChange={(e) => handleAllocationChange(rep.code, e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={saving}
                >
                  <option value="">Select a vehicle</option>
                  {Object.entries(vehicles).map(([registration, vehicle]) => (
                    <option 
                      key={registration} 
                      value={registration}
                      disabled={allocations.some(a => 
                        a.vehicle === registration && 
                        !a.end_date && 
                        a.rep_code !== rep.code
                      )}
                    >
                      {registration} - {vehicle.make} {vehicle.model} ({vehicle.year})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>

        {/* Allocation History */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Allocation History</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sales Rep
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vehicle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vehicle Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    End Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {allocations.map(allocation => {
                  const rep = salesReps.find(r => r.code === allocation.rep_code);
                  const vehicle = vehicles[allocation.vehicle];
                  return (
                    <tr key={allocation.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {rep?.name} ({allocation.rep_code})
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {allocation.vehicle}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {vehicle ? `${vehicle.make} ${vehicle.model} (${vehicle.year})` : 'Unknown Vehicle'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(allocation.start_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {allocation.end_date 
                          ? new Date(allocation.end_date).toLocaleDateString()
                          : 'Current'
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedAllocation(allocation);
                              setEditMode(true);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit allocation"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteAllocation(allocation.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete allocation"
                            disabled={saving}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit Allocation Modal */}
      {selectedAllocation && editMode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="px-6 py-4 bg-blue-600 flex justify-between items-center rounded-t-lg">
              <h3 className="text-xl font-bold text-white">Edit Allocation</h3>
              <button
                onClick={() => {
                  setSelectedAllocation(null);
                  setEditMode(false);
                }}
                className="text-white hover:text-blue-100"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Sales Rep</label>
                  <input
                    type="text"
                    value={`${salesReps.find(r => r.code === selectedAllocation.rep_code)?.name || ''} (${selectedAllocation.rep_code})`}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 bg-gray-50"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Vehicle</label>
                  <input
                    type="text"
                    value={`${selectedAllocation.vehicle} - ${vehicles[selectedAllocation.vehicle]?.make} ${vehicles[selectedAllocation.vehicle]?.model} (${vehicles[selectedAllocation.vehicle]?.year})`}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 bg-gray-50"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                  <input
                    type="date"
                    value={new Date(selectedAllocation.start_date).toISOString().split('T')[0]}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 bg-gray-50"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">End Date</label>
                  <input
                    type="date"
                    value={selectedAllocation.end_date ? new Date(selectedAllocation.end_date).toISOString().split('T')[0] : ''}
                    onChange={(e) => setSelectedAllocation({
                      ...selectedAllocation,
                      end_date: e.target.value ? new Date(e.target.value).toISOString() : null
                    })}
                    min={new Date(selectedAllocation.start_date).toISOString().split('T')[0]}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedAllocation(null);
                    setEditMode(false);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateAllocation(selectedAllocation)}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleAllocationSection;