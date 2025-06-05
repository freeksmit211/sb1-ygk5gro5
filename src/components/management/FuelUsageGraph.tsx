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
import { FuelEntry } from '../../types/fuel';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface FuelUsageGraphProps {
  entries: FuelEntry[];
}

const FuelUsageGraph: React.FC<FuelUsageGraphProps> = ({ entries }) => {
  // Financial year months (March to February)
  const MONTHS = [
    'March', 'April', 'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December', 'January', 'February'
  ];
  
  const getMonthlyData = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    // Determine if we're in the current or next calendar year for Jan/Feb
    const financialYear = currentMonth < 2 ? currentYear : currentYear + 1;
    
    const monthlyUsage = MONTHS.map(month => {
      const monthIndex = new Date(`${month} 1`).getMonth();
      const year = monthIndex <= 1 ? financialYear : financialYear - 1;
      
      return entries.reduce((total, entry) => {
        const entryDate = new Date(entry.date);
        if (
          entryDate.getMonth() === monthIndex &&
          entryDate.getFullYear() === year
        ) {
          return total + entry.liters;
        }
        return total;
      }, 0);
    });

    return {
      labels: MONTHS.map(month => `${month} ${month === 'January' || month === 'February' ? financialYear : financialYear - 1}`),
      data: monthlyUsage
    };
  };

  const { labels, data } = getMonthlyData();

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Fuel Usage (Liters)',
        data: data,
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `Financial Year Fuel Usage (Mar 2024 - Feb 2025)`,
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
            return `${value.toFixed(2)} L`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Liters'
        }
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="h-[400px]">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default FuelUsageGraph;