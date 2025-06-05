import React, { useState, useEffect, useRef } from 'react';
import { Search, Eye, Calendar, Car, User, Fuel, Download, Pencil, Trash2 } from 'lucide-react';
import { addFuelEntry, getFuelEntries, updateFuelEntry, deleteFuelEntry } from '../../services/fuelService';
import FuelFormField from './FuelFormField';
import VehicleSelect from './VehicleSelect';
import { supabase } from '../../lib/supabase';
import { FuelEntry } from '../../types/fuel';
import { generateFuelEntryPDF } from '../../utils/pdfGenerator';

interface AppUser {
  id: string;
  name: string;
  surname: string;
  role: string;
}

const DRIVERS = [
  'Angilique',
  'Billy',
  'Chanell',
  'Cindy',
  'Daan',
  'Elize',
  'Franco',
  'Freek',
  'Izahn',
  'Jeckie',
  'Leon',
  'Matthews',
  'Petros'
];

const FuelForm: React.FC = () => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    slipNumber: '',
    vehicle: '',
    driver: '',
    driverName: '',
    odometer: '',
    pumpReadingBefore: '',
    pumpReadingAfter: '',
    liters: '',
    allocatedTo: ''
  });

  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState<FuelEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [editingEntry, setEditingEntry] = useState<FuelEntry | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFuelEntries();
  }, []);

  const loadFuelEntries = async () => {
    try {
      setLoading(true);
      setError(null);
      const entries = await getFuelEntries();
      setEntries(entries);
    } catch (error) {
      console.error('Failed to load fuel entries:', error);
      setError('Failed to load fuel entries. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (formData.pumpReadingBefore && formData.pumpReadingAfter) {
      const before = parseFloat(formData.pumpReadingBefore);
      const after = parseFloat(formData.pumpReadingAfter);
      if (!isNaN(before) && !isNaN(after) && after >= before) {
        const liters = (after - before).toFixed(2);
        setFormData(prev => ({ ...prev, liters }));
      }
    }
  }, [formData.pumpReadingBefore, formData.pumpReadingAfter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      setError(null);

      // Validate input values
      const odometer = Number(formData.odometer);
      const pumpReadingBefore = Number(formData.pumpReadingBefore);
      const pumpReadingAfter = Number(formData.pumpReadingAfter);
      const liters = Number(formData.liters);

      if (isNaN(odometer) || isNaN(pumpReadingBefore) || isNaN(pumpReadingAfter) || isNaN(liters)) {
        throw new Error('Please enter valid numbers for odometer and pump readings');
      }

      if (pumpReadingAfter <= pumpReadingBefore) {
        throw new Error('Pump reading after must be greater than pump reading before');
      }

      if (editingEntry) {
        await updateFuelEntry(editingEntry.id, {
          date: formData.date,
          slipNumber: formData.slipNumber,
          vehicle: formData.vehicle,
          driver: formData.driver,
          driverName: formData.driverName,
          odometer: odometer,
          pumpReadingBefore: pumpReadingBefore,
          pumpReadingAfter: pumpReadingAfter,
          liters: liters,
          allocatedTo: formData.allocatedTo || undefined
        });
      } else {
        await addFuelEntry({
          date: formData.date,
          slipNumber: formData.slipNumber,
          vehicle: formData.vehicle,
          driver: formData.driver,
          driverName: formData.driverName,
          odometer: odometer,
          pumpReadingBefore: pumpReadingBefore,
          pumpReadingAfter: pumpReadingAfter,
          liters: liters,
          allocatedTo: formData.allocatedTo || undefined
        });
      }
      
      // Reset form
      setFormData({
        date: new Date().toISOString().split('T')[0],
        slipNumber: '',
        vehicle: '',
        driver: '',
        driverName: '',
        odometer: '',
        pumpReadingBefore: '',
        pumpReadingAfter: '',
        liters: '',
        allocatedTo: ''
      });
      setEditingEntry(null);

      // Show success message
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      
      // Reload entries
      await loadFuelEntries();
    } catch (error: any) {
      console.error('Failed to save fuel entry:', error);
      setError(error.message || 'Failed to save fuel entry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (entry: FuelEntry) => {
    setEditingEntry(entry);
    setFormData({
      date: new Date(entry.date).toISOString().split('T')[0],
      slipNumber: entry.slipNumber,
      vehicle: entry.vehicle,
      driver: entry.driver,
      driverName: entry.driverName || '',
      odometer: entry.odometer.toString(),
      pumpReadingBefore: entry.pumpReadingBefore.toString(),
      pumpReadingAfter: entry.pumpReadingAfter.toString(),
      liters: entry.liters.toString(),
      allocatedTo: entry.allocatedTo || ''
    });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this fuel entry?')) {
      return;
    }

    try {
      setDeletingId(id);
      setError(null);
      await deleteFuelEntry(id);
      setEntries(prev => prev.filter(entry => entry.id !== id)); // Update UI immediately
    } catch (error) {
      console.error('Failed to delete fuel entry:', error);
      setError('Failed to delete fuel entry. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleDriverChange = (userId: string) => {
    const selectedUser = users.find(user => user.id === userId);
    if (selectedUser) {
      setFormData(prev => ({
        ...prev,
        driver: userId,
        driverName: `${selectedUser.name} ${selectedUser.surname}`
      }));
    }
  };

  const filteredEntries = entries.filter(entry => {
    const searchLower = searchQuery.toLowerCase();
    return (
      entry.vehicle.toLowerCase().includes(searchLower) ||
      entry.driver.toLowerCase().includes(searchLower) ||
      (entry.driverName && entry.driverName.toLowerCase().includes(searchLower)) ||
      entry.slipNumber.toLowerCase().includes(searchLower) ||
      (entry.allocatedTo && entry.allocatedTo.toLowerCase().includes(searchLower))
    );
  });

  const displayedEntries = showAll ? filteredEntries : filteredEntries.slice(0, 5);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-8">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 text-green-800 p-4 rounded-lg">
          Fuel entry {editingEntry ? 'updated' : 'added'} successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FuelFormField
            label="Date"
            type="date"
            value={formData.date}
            onChange={(value) => setFormData(prev => ({ ...prev, date: value }))}
          />
          <FuelFormField
            label="Slip Number"
            value={formData.slipNumber}
            onChange={(value) => setFormData(prev => ({ ...prev, slipNumber: value }))}
          />
          <VehicleSelect
            value={formData.vehicle}
            onChange={(value) => setFormData(prev => ({ ...prev, vehicle: value }))}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700">Driver</label>
            <select
              value={formData.driver}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                driver: e.target.value,
                driverName: e.target.value
              }))}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
              required
            >
              <option value="">Select a driver</option>
              {DRIVERS.map(driver => (
                <option key={driver} value={driver}>{driver}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Allocated To</label>
            <select
              value={formData.allocatedTo}
              onChange={(e) => setFormData(prev => ({ ...prev, allocatedTo: e.target.value }))}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
            >
              <option value="">Not Allocated</option>
              {DRIVERS.map(driver => (
                <option key={driver} value={driver}>{driver}</option>
              ))}
            </select>
          </div>
          <FuelFormField
            label="Odometer Reading"
            type="number"
            value={formData.odometer}
            onChange={(value) => setFormData(prev => ({ ...prev, odometer: value }))}
          />
          <FuelFormField
            label="Pump Reading Before"
            type="number"
            value={formData.pumpReadingBefore}
            onChange={(value) => setFormData(prev => ({ ...prev, pumpReadingBefore: value }))}
            step="0.01"
          />
          <FuelFormField
            label="Pump Reading After"
            type="number"
            value={formData.pumpReadingAfter}
            onChange={(value) => setFormData(prev => ({ ...prev, pumpReadingAfter: value }))}
            step="0.01"
          />
          <FuelFormField
            label="Liters"
            type="number"
            value={formData.liters}
            onChange={(value) => setFormData(prev => ({ ...prev, liters: value }))}
            step="0.01"
            disabled={true}
          />
        </div>
        <div className="flex justify-end gap-2">
          {editingEntry && (
            <button
              type="button"
              onClick={() => {
                setEditingEntry(null);
                setFormData({
                  date: new Date().toISOString().split('T')[0],
                  slipNumber: '',
                  vehicle: '',
                  driver: '',
                  driverName: '',
                  odometer: '',
                  pumpReadingBefore: '',
                  pumpReadingAfter: '',
                  liters: '',
                  allocatedTo: ''
                });
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel Edit
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              editingEntry ? 'Update Entry' : 'Submit Fuel Entry'
            )}
          </button>
        </div>
      </form>

      {/* Fuel Entries List */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Fuel Entries</h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search entries..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
            <button
              onClick={() => setShowAll(!showAll)}
              className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span>{showAll ? 'Show Less' : 'View All'}</span>
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {displayedEntries.map(entry => (
            <div key={entry.id} className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <Car className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">{entry.vehicle}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(entry.date)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">{entry.driver}</p>
                    {entry.driverName && (
                      <p className="text-sm text-gray-500">{entry.driverName}</p>
                    )}
                    {entry.allocatedTo && (
                      <p className="text-sm text-blue-600">Allocated to: {entry.allocatedTo}</p>
                    )}
                    <p className="text-sm text-gray-500">Slip #{entry.slipNumber}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Fuel className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="font-medium text-gray-900">{entry.liters.toFixed(2)} L</p>
                      <p className="text-sm text-gray-500">{entry.odometer.toLocaleString()} km</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(entry)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit entry"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete entry"
                      disabled={!!deletingId}
                    >
                      {deletingId === entry.id ? (
                        <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => generateFuelEntryPDF(entry)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Download PDF"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredEntries.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No fuel entries found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FuelForm;