import React from 'react';
import { FuelEntry } from '../../types/fuel';
import { Fuel } from 'lucide-react';

interface MonthlyFuelUsageProps {
  entries: FuelEntry[];
}

const MonthlyFuelUsage: React.FC<MonthlyFuelUsageProps> = ({ entries }) => {
  const getLastThreeMonths = () => {
    const months = [];
    for (let i = 0; i < 3; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      months.push({
        name: date.toLocaleString('default', { month: 'long' }),
        year: date.getFullYear(),
        timestamp: date.getTime()
      });
    }
    return months.reverse();
  };

  const calculateMonthlyUsage = (month: string, year: number) => {
    return entries.reduce((total, entry) => {
      const entryDate = new Date(entry.date);
      if (
        entryDate.getMonth() === new Date(`${month} 1`).getMonth() &&
        entryDate.getFullYear() === year
      ) {
        return total + entry.liters;
      }
      return total;
    }, 0);
  };

  const lastThreeMonths = getLastThreeMonths();

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
      <div className="flex items-center gap-2 mb-4 md:mb-6">
        <Fuel className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
        <h2 className="text-lg md:text-xl font-bold text-gray-900">Monthly Fuel Usage</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {lastThreeMonths.map(({ name, year, timestamp }) => (
          <div key={timestamp} className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">
              {name} {year}
            </h3>
            <div className="mt-2">
              <div className="text-lg md:text-2xl font-bold text-blue-600 break-all">
                {calculateMonthlyUsage(name, year).toFixed(2)} L
              </div>
              <p className="text-xs md:text-sm text-gray-500 mt-1">Total Usage</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonthlyFuelUsage;