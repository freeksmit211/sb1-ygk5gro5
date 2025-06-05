import React, { useState, useEffect } from 'react';
import { FileText, Calendar, Car, Pencil, Plus, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import VehicleLicenseModal from './VehicleLicenseModal';
import { useAuth } from '../../contexts/AuthContext';

interface VehicleLicense {
  id: string;
  vehicle: string;
  expiry_date: string;
  renewal_reminder_sent: boolean;
  created_at: string;
}

const VehicleLicenseSection: React.FC = () => {
  const { user } = useAuth();
  const [licenses, setLicenses] = useState<VehicleLicense[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState<{
    registration: string;
    expiryDate?: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const canManageLicenses = user?.role === 'superAdmin' || user?.role === 'management';

  useEffect(() => {
    loadLicenses();
  }, []);

  const loadLicenses = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('vehicle_licenses')
        .select('*')
        .order('expiry_date', { ascending: true });

      if (error) throw error;
      setLicenses(data || []);
    } catch (error: any) {
      console.error('Error loading licenses:', error);
      setError('Failed to load vehicle licenses');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDeleting) return;

    if (!window.confirm('Are you sure you want to delete this license record? This action cannot be undone.')) {
      return;
    }

    try {
      setIsDeleting(true);
      setError(null);

      const { error } = await supabase
        .from('vehicle_licenses')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setLicenses(prev => prev.filter(license => license.id !== id));
    } catch (error: any) {
      console.error('Failed to delete license:', error);
      setError('Failed to delete license record');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getExpiryStatus = (expiryDate: string) => {
    const days = Math.ceil(
      (new Date(expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (days < 0) return { color: 'bg-red-100 text-red-800', text: 'Expired' };
    if (days <= 30) return { color: 'bg-yellow-100 text-yellow-800', text: `Expires in ${days} days` };
    return { color: 'bg-green-100 text-green-800', text: 'Valid' };
  };

  const handleVehicleClick = (vehicle: string, expiryDate?: string) => {
    setSelectedVehicle({
      registration: vehicle,
      expiryDate
    });
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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">Vehicle License Renewals</h2>
        </div>
        {canManageLicenses && (
          <button
            onClick={() => setSelectedVehicle({ registration: '' })}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            Add License
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {licenses.map(license => {
          const status = getExpiryStatus(license.expiry_date);
          return (
            <div 
              key={license.id} 
              className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer"
              onClick={() => handleVehicleClick(license.vehicle, license.expiry_date)}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Car className="w-5 h-5 text-blue-600" />
                  <div>
                    <h3 className="font-medium text-gray-900">{license.vehicle}</h3>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      Expires: {formatDate(license.expiry_date)}
                    </span>
                  </div>
                  <span className={`px-3 py-1 text-sm rounded-full ${status.color}`}>
                    {status.text}
                  </span>
                  {canManageLicenses && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVehicleClick(license.vehicle, license.expiry_date);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit license"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(license.id, e)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete license"
                        disabled={isDeleting}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {licenses.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No license records found
          </div>
        )}
      </div>

      {selectedVehicle && (
        <VehicleLicenseModal
          isOpen={true}
          onClose={() => setSelectedVehicle(null)}
          vehicle={selectedVehicle.registration}
          expiryDate={selectedVehicle.expiryDate}
          onUpdate={loadLicenses}
          canManageLicenses={canManageLicenses}
        />
      )}
    </div>
  );
};

export default VehicleLicenseSection;