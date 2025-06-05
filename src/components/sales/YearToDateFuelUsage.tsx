import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Fuel } from 'lucide-react';
import { FuelEntry } from '../../types/fuel';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface YearToDateFuelUsageProps {
  entries: FuelEntry[];
  repId: string;
}

const YearToDateFuelUsage: React.FC<YearToDateFuelUsageProps> = ({ entries, repId }) => {
  // Financial year months (March to February)
  const MONTHS = [
    'March', 'April', 'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December', 'January', 'February'
  ];

  // Get monthly data for the financial year
  const getMonthlyData = () => {
    return MONTHS.map(month => {
      // Filter entries for this month and rep
      const monthEntries = entries.filter(entry => {
        const entryDate = new Date(entry.date);
        const entryMonth = entryDate.toLocaleString('default', { month: 'long' });
        const isCurrentYear = month === 'January' || month === 'February' 
          ? entryDate.getFullYear() === 2025 
          : entryDate.getFullYear() === 2024;
        
        return (
          entryMonth === month &&
          isCurrentYear &&
          entry.driver.toLowerCase() === repId.toLowerCase()
        );
      });

      // Calculate total liters for the month
      const liters = monthEntries.reduce((total, entry) => total + entry.liters, 0);

      // Calculate kilometers for the month
      let startOdometer = Infinity;
      let endOdometer = 0;
      monthEntries.forEach(entry => {
        if (entry.odometer < startOdometer) {
          startOdometer = entry.odometer;
        }
        if (entry.odometer > endOdometer) {
          endOdometer = entry.odometer;
        }
      });
      const kilometers = startOdometer === Infinity ? 0 : endOdometer - startOdometer;

      return {
        month,
        liters,
        kilometers,
        year: month === 'January' || month === 'February' ? 2025 : 2024
      };
    });
  };

  const monthlyData = getMonthlyData();

  const chartData = {
    labels: monthlyData.map(d => `${d.month} ${d.year}`),
    datasets: [
      {
        label: 'Fuel Usage (Liters)',
        data: monthlyData.map(d => d.liters),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
        yAxisID: 'y'
      },
      {
        label: 'Distance (Kilometers)',
        data: monthlyData.map(d => d.kilometers),
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 1,
        yAxisID: 'y1'
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Financial Year Fuel Usage (Mar 2024 - Feb 2025)',
        color: '#1f2937',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.raw || 0;
            if (context.dataset.label.includes('Liters')) {
              return `${value.toFixed(2)} L`;
            }
            return `${value.toLocaleString()} km`;
          }
        }
      }
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Liters'
        },
        grid: {
          drawOnChartArea: false
        }
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Kilometers'
        },
        grid: {
          drawOnChartArea: false
        }
      }
    }
  };

  // Calculate totals
  const totalLiters = monthlyData.reduce((total, month) => total + month.liters, 0);
  const totalKilometers = monthlyData.reduce((total, month) => total + month.kilometers, 0);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Fuel className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-900">Financial Year Fuel Usage</h2>
      </div>

      <div className="h-[400px]">
        <Bar data={chartData} options={options} />
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Fuel Used</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">
                {totalLiters.toFixed(2)} L
              </p>
            </div>
            <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Fuel className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-green-600 font-medium">Total Distance</p>
              <p className="text-2xl font-bold text-green-900 mt-1">
                {totalKilometers.toLocaleString()} km
              </p>
            </div>
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 font-bold">KM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YearToDateFuelUsage;