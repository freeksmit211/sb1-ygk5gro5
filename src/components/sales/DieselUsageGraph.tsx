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

interface DieselUsageGraphProps {
  entries: FuelEntry[];
  repId: string;
}

const DieselUsageGraph: React.FC<DieselUsageGraphProps> = ({ entries, repId }) => {
  const getMonthlyData = () => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const currentMonth = new Date().getMonth();
    const ytdMonths = months.slice(0, currentMonth + 1);
    
    const monthlyUsage = ytdMonths.map(month => {
      return entries.reduce((total, entry) => {
        const entryDate = new Date(entry.date);
        if (
          entryDate.getMonth() === months.indexOf(month) &&
          entryDate.getFullYear() === new Date().getFullYear() &&
          entry.driver.toLowerCase() === repId
        ) {
          return total + entry.liters;
        }
        return total;
      }, 0);
    });

    return {
      labels: ytdMonths,
      data: monthlyUsage
    };
  };

  const { labels, data } = getMonthlyData();

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Diesel Usage (Liters)',
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
        text: `Year to Date Diesel Usage - ${new Date().getFullYear()}`,
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

export default DieselUsageGraph;