import React from 'react';
import { FuelEntry } from '../../types/fuel';
import { Car, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface VehicleFuelUsageProps {
  entries: FuelEntry[];
}

interface VehicleAllocation {
  vehicle: string;
  allocatedTo: string | null;
}

const VehicleFuelUsage: React.FC<VehicleFuelUsageProps> = ({ entries }) => {
  const [allocations, setAllocations] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadAllocations = async () => {
      try {
        const { data, error } = await supabase
          .from('vehicles')
          .select('registration, allocated_to')
          .not('allocated_to', 'is', null);

        if (error) throw error;

        const allocationMap = data.reduce((acc: Record<string, string>, curr) => {
          if (curr.allocated_to) {
            acc[curr.registration] = curr.allocated_to;
          }
          return acc;
        }, {});

        setAllocations(allocationMap);
      } catch (error) {
        console.error('Error loading vehicle allocations:', error);
      }
    };

    loadAllocations();
  }, []);

  const getLastThreeMonths = () => {
    const months = [];
    for (let i = 0; i < 3; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      months.push({
        name: date.toLocaleString('default', { month: 'long' }),
        year: date.getFullYear()
      });
    }
    return months.reverse();
  };

  const calculateVehicleMonthlyUsage = (vehicle: string, month: string, year: number) => {
    return entries.reduce((total, entry) => {
      const entryDate = new Date(entry.date);
      if (
        entry.vehicle === vehicle &&
        entryDate.getMonth() === new Date(`${month} 1`).getMonth() &&
        entryDate.getFullYear() === year
      ) {
        return total + entry.liters;
      }
      return total;
    }, 0);
  };

  const getUniqueVehicles = () => {
    return Array.from(new Set(entries.map(entry => entry.vehicle))).sort();
  };

  const lastThreeMonths = getLastThreeMonths();
  const vehicles = getUniqueVehicles();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <Car className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-900">Individual Vehicle Usage</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vehicle
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Allocated To
              </th>
              {lastThreeMonths.map(({ name, year }) => (
                <th key={`${name}-${year}`} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {name} {year}
                </th>
              ))}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {vehicles.map(vehicle => {
              const monthlyUsage = lastThreeMonths.map(({ name, year }) => 
                calculateVehicleMonthlyUsage(vehicle, name, year)
              );
              const totalUsage = monthlyUsage.reduce((a, b) => a + b, 0);

              return (
                <tr key={vehicle} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {vehicle}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {allocations[vehicle] ? (
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span>{allocations[vehicle]}</span>
                      </div>
                    ) : (
                      '-'
                    )}
                  </td>
                  {monthlyUsage.map((usage, index) => (
                    <td key={index} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {usage.toFixed(2)} L
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                    {totalUsage.toFixed(2)} L
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VehicleFuelUsage;