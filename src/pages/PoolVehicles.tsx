import React, { useState, useEffect } from 'react';
import { ArrowLeft, Car, Plus, Search, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PoolVehicle } from '../types/vehicle';
import BookVehicleModal from '../components/vehicles/BookVehicleModal';
import ReturnVehicleModal from '../components/vehicles/ReturnVehicleModal';
import { getPoolVehicles, bookVehicle, returnVehicle } from '../services/vehicleService';

const EMPLOYEES = [
  'Angilique', 'Billy', 'Chanell', 'Cindy', 'Daan', 'Elize',
  'Franco', 'Freek', 'Izahn', 'Jeckie', 'Leon', 'Matthews', 'Petros'
];

const PoolVehicles: React.FC = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<PoolVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState<PoolVehicle | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPoolVehicles();
      setVehicles(data);
    } catch (error) {
      console.error('Failed to load vehicles:', error);
      setError('Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  };

  const handleBookVehicle = async (vehicleId: string, employeeId: string) => {
    try {
      await bookVehicle({
        vehicleId,
        employeeId,
        employeeName: employeeId, // Using the name directly since it's the ID
        startDate: new Date().toISOString(),
        status: 'active'
      });
      await loadVehicles();
      setIsBookingModalOpen(false);
    } catch (error) {
      console.error('Failed to book vehicle:', error);
    }
  };

  const handleReturnVehicle = async (bookingId: string, pin: string) => {
    try {
      await returnVehicle(bookingId, pin);
      await loadVehicles();
      setIsReturnModalOpen(false);
    } catch (error) {
      console.error('Failed to return vehicle:', error);
    }
  };

  const getStatusColor = (status: PoolVehicle['status']) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'booked':
        return 'bg-blue-100 text-blue-800';
      case 'maintenance':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredVehicles = vehicles.filter(vehicle => {
    const searchLower = searchQuery.toLowerCase();
    return (
      vehicle.registration.toLowerCase().includes(searchLower) ||
      (vehicle.make?.toLowerCase().includes(searchLower) || false) ||
      (vehicle.model?.toLowerCase().includes(searchLower) || false)
    );
  });

  if (loading) {
    return (
      <div className="p-6 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="text-white hover:text-blue-100"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-white">Pool Vehicles</h1>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-lg">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Car className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Available Vehicles</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search vehicles..."
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Make/Model
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current User
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredVehicles.map(vehicle => (
                <tr key={vehicle.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {vehicle.registration}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {vehicle.make} {vehicle.model} ({vehicle.year})
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(vehicle.status)}`}>
                      {vehicle.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {vehicle.currentBooking?.employeeName || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {vehicle.currentBooking ? (
                      <button
                        onClick={() => {
                          setSelectedVehicle(vehicle);
                          setIsReturnModalOpen(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Return
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedVehicle(vehicle);
                          setIsBookingModalOpen(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                        disabled={vehicle.status !== 'available'}
                      >
                        Book
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filteredVehicles.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No vehicles found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedVehicle && (
        <>
          <BookVehicleModal
            isOpen={isBookingModalOpen}
            onClose={() => {
              setIsBookingModalOpen(false);
              setSelectedVehicle(null);
            }}
            vehicle={selectedVehicle}
            onBook={handleBookVehicle}
            employees={EMPLOYEES}
          />

          <ReturnVehicleModal
            isOpen={isReturnModalOpen}
            onClose={() => {
              setIsReturnModalOpen(false);
              setSelectedVehicle(null);
            }}
            vehicle={selectedVehicle}
            onReturn={handleReturnVehicle}
          />
        </>
      )}
    </div>
  );
};

export default PoolVehicles;