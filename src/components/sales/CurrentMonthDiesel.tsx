import React from 'react';
import { Fuel } from 'lucide-react';
import { FuelEntry } from '../../types/fuel';

interface CurrentMonthDieselProps {
  entries: FuelEntry[];
  repId: string;
}

const CurrentMonthDiesel: React.FC<CurrentMonthDieselProps> = ({ entries, repId }) => {
  const getCurrentMonthUsage = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return entries.reduce((total, entry) => {
      const entryDate = new Date(entry.date);
      if (
        entryDate.getMonth() === currentMonth &&
        entryDate.getFullYear() === currentYear &&
        entry.driver.toLowerCase() === repId
      ) {
        return total + entry.liters;
      }
      return total;
    }, 0);
  };

  const currentMonthUsage = getCurrentMonthUsage();
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <Fuel className="w-6 h-6 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900">Current Month Diesel Usage</h2>
      </div>
      
      <div className="bg-blue-50 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-blue-600 font-medium">{currentMonth}</p>
            <p className="text-2xl font-bold text-blue-900 mt-1">
              {currentMonthUsage.toFixed(2)} L
            </p>
          </div>
          <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
            <Fuel className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentMonthDiesel;