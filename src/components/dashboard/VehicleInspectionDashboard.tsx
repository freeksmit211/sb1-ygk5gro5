import React, { useState, useEffect } from 'react';
import { AlertTriangle, Car, Settings, Plus, Clock, Download } from 'lucide-react';
import { getVehicleServices } from '../../services/vehicleService';
import { getFuelEntries } from '../../services/fuelService';
import { VehicleService } from '../../types/vehicle';
import { FuelEntry } from '../../types/fuel';
import VehicleServiceModal from './VehicleServiceModal';

const VEHICLES = [
  'HXJ 207 MP',
  'JDT 129 MP',
  'JTC 430 MP',
  'JTC 437 MP',
  'JXZ 199 MP',
  'KPJ 902 MP',
  'KPN 084 MP',
  'KPN 089 MP',
  'KRM 836 MP',
  'KRP 201 MP',
  'KWR 435 MP',
  'KZJ 664 MP',
  'KZW 922 MP'
];

interface VehicleStatus {
  vehicle: string;
  currentKm: number;
  nextServiceKm: number;
  kmToService: number;
  notes?: string;
}

const VehicleInspectionDashboard: React.FC = () => {
  const [services, setServices] = useState<VehicleService[]>([]);
  const [fuelEntries, setFuelEntries] = useState<FuelEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [vehicleStatuses, setVehicleStatuses] = useState<VehicleStatus[]>([]);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [servicesData, fuelData] = await Promise.all([
        getVehicleServices(),
        getFuelEntries()
      ]);
      
      setServices(servicesData);
      setFuelEntries(fuelData);

      // Get latest odometer reading for each vehicle
      const latestOdometers = new Map<string, number>();
      fuelData.forEach(entry => {
        const existing = latestOdometers.get(entry.vehicle);
        if (!existing || entry.odometer > existing) {
          latestOdometers.set(entry.vehicle, entry.odometer);
        }
      });

      // Get latest service data for each vehicle
      const latestServices = new Map<string, VehicleService>();
      servicesData.forEach(service => {
        const existing = latestServices.get(service.vehicle);
        if (!existing || service.serviceKm > existing.serviceKm) {
          latestServices.set(service.vehicle, service);
        }
      });

      // Initialize all vehicles with current status
      const vehicleMap = new Map<string, VehicleStatus>(
        VEHICLES.map(vehicle => {
          const currentKm = latestOdometers.get(vehicle) || 0;
          const latestService = latestServices.get(vehicle);
          const nextServiceKm = latestService?.nextServiceKm || 0;
          
          return [vehicle, {
            vehicle,
            currentKm,
            nextServiceKm,
            kmToService: nextServiceKm > 0 ? nextServiceKm - currentKm : 0,
            notes: latestService?.notes
          }];
        })
      );

      setVehicleStatuses(Array.from(vehicleMap.values())
        .sort((a, b) => a.vehicle.localeCompare(b.vehicle)));

    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleServiceUpdate = () => {
    loadData();
    setIsServiceModalOpen(false);
    setSelectedVehicle(null);
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
        <div className="flex items-center gap-3">
          <Car className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">Vehicle Service Status</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vehicleStatuses.map(status => (
          <div 
            key={status.vehicle}
            className={`p-4 rounded-lg border ${
              status.kmToService <= 2000 && status.kmToService > 0
                ? 'bg-red-50 border-red-200'
                : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-gray-900">{status.vehicle}</h3>
              </div>
              <div className="flex items-center gap-2">
                {status.kmToService <= 2000 && status.kmToService > 0 && (
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                )}
                <button
                  onClick={() => {
                    setSelectedVehicle(status.vehicle);
                    setIsServiceModalOpen(true);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Update Service Info"
                >
                  <Settings className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Current KM:</span>
                <span className="font-medium">
                  {status.currentKm > 0 ? status.currentKm.toLocaleString() : 'Not set'} km
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Next Service:</span>
                <span className="font-medium">
                  {status.nextServiceKm > 0 ? status.nextServiceKm.toLocaleString() : 'Not set'} km
                </span>
              </div>
              {status.kmToService > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">KM to Service:</span>
                  <span className={`font-medium ${
                    status.kmToService <= 2000 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {status.kmToService.toLocaleString()} km
                  </span>
                </div>
              )}
              {status.notes && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <span className="text-sm text-gray-600">Notes:</span>
                  <p className="text-sm text-gray-700 mt-1">{status.notes}</p>
                </div>
              )}
            </div>

            {status.kmToService <= 2000 && status.kmToService > 0 && (
              <div className="mt-4 p-3 bg-red-100 rounded-lg flex items-center gap-2 text-sm text-red-700">
                <AlertTriangle className="w-4 h-4" />
                <span>Service required within {status.kmToService.toLocaleString()} km</span>
              </div>
            )}

            {!status.currentKm && (
              <div className="mt-4 p-3 bg-yellow-100 rounded-lg flex items-center gap-2 text-sm text-yellow-700">
                <AlertTriangle className="w-4 h-4" />
                <span>No odometer reading available</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <VehicleServiceModal
        isOpen={isServiceModalOpen}
        onClose={() => {
          setIsServiceModalOpen(false);
          setSelectedVehicle(null);
        }}
        vehicle={selectedVehicle}
        currentMileage={selectedVehicle ? 
          vehicleStatuses.find(s => s.vehicle === selectedVehicle)?.currentKm || 0 : 0}
        onServiceAdded={handleServiceUpdate}
      />
    </div>
  );
};

export default VehicleInspectionDashboard;