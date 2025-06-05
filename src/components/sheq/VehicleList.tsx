import React, { useState } from 'react';
import { Vehicle } from '../../types/sheq';
import { Car, Calendar, AlertTriangle, Download, Pencil, Trash2 } from 'lucide-react';
import EditVehicleModal from './EditVehicleModal';
import { deleteVehicle } from '../../services/sheqService';

interface VehicleListProps {
  vehicles: Vehicle[];
  companyId: string;
  onDocumentUploaded: () => void;
}

const VehicleList: React.FC<VehicleListProps> = ({ 
  vehicles,
  companyId,
  onDocumentUploaded
}) => {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  const handleDelete = async (vehicleId: string) => {
    if (!window.confirm('Are you sure you want to delete this vehicle? This action cannot be undone.')) {
      return;
    }

    try {
      setDeletingId(vehicleId);
      await deleteVehicle(vehicleId);
      await onDocumentUploaded(); // Refresh the list
    } catch (error) {
      console.error('Failed to delete vehicle:', error);
      alert('Failed to delete vehicle. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  if (vehicles.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Car className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p>No vehicles registered yet</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {vehicles.map(vehicle => (
        <div key={vehicle.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Car className="w-6 h-6 text-gray-500" />
                <div>
                  <h3 className="font-semibold text-gray-900">{vehicle.registration}</h3>
                  <p className="text-sm text-gray-500">{vehicle.make} {vehicle.model} ({vehicle.year})</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedVehicle(vehicle);
                    setIsEditModalOpen(true);
                  }}
                  className="p-1 text-blue-600 hover:text-blue-700 rounded-full hover:bg-blue-50"
                  title="Edit vehicle"
                  disabled={!!deletingId}
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(vehicle.id)}
                  className="p-1 text-red-600 hover:text-red-700 rounded-full hover:bg-red-50"
                  title="Delete vehicle"
                  disabled={!!deletingId}
                >
                  {deletingId === vehicle.id ? (
                    <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {vehicle.permit ? (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900">Permit</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      getExpiryStatus(vehicle.permit.expiryDate).color
                    }`}>
                      {getExpiryStatus(vehicle.permit.expiryDate).text}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <Calendar className="w-4 h-4" />
                    <span>Expires: {formatDate(vehicle.permit.expiryDate)}</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <a
                      href={vehicle.permit.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                    >
                      <Download className="w-4 h-4" />
                      <span className="text-sm">Download Permit</span>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 rounded-lg p-4 flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  <p className="text-sm text-yellow-700">No permit uploaded</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {selectedVehicle && (
        <EditVehicleModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedVehicle(null);
          }}
          vehicle={selectedVehicle}
          onVehicleUpdated={onDocumentUploaded}
        />
      )}
    </div>
  );
};

export default VehicleList;