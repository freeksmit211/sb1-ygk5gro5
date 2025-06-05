import React, { useState, useEffect } from 'react';
import { Fuel } from 'lucide-react';
import { getFuelEntries } from '../../services/fuelService';
import { FuelEntry } from '../../types/fuel';
import FuelUsageGraph from './FuelUsageGraph';
import MonthlyFuelUsage from './MonthlyFuelUsage';
import VehicleFuelUsage from './VehicleFuelUsage';

const FuelUsageSection: React.FC = () => {
  const [fuelEntries, setFuelEntries] = useState<FuelEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFuelEntries();
  }, []);

  const loadFuelEntries = async () => {
    try {
      setLoading(true);
      const entries = await getFuelEntries();
      setFuelEntries(entries);
    } catch (error) {
      console.error('Failed to load fuel entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalLiters = () => {
    return fuelEntries.reduce((total, entry) => total + entry.liters, 0);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const totalLiters = calculateTotalLiters();

  return (
    <div className="space-y-8">
      <FuelUsageGraph entries={fuelEntries} />

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <Fuel className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">Collective Fuel Usage</h2>
        </div>

        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Total Fuel Usage</h3>
          <p className="text-3xl font-bold text-blue-600">{totalLiters.toFixed(2)} L</p>
        </div>
      </div>

      <MonthlyFuelUsage entries={fuelEntries} />
      <VehicleFuelUsage entries={fuelEntries} />
    </div>
  );
};

export default FuelUsageSection;