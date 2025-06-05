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
import { MonthlyBudget } from '../../types/budget';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface YearToDateGraphProps {
  data: Record<string, MonthlyBudget>;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const YearToDateGraph: React.FC<YearToDateGraphProps> = ({ data }) => {
  const currentMonth = new Date().getMonth();
  const ytdMonths = MONTHS.slice(0, currentMonth + 1);

  const chartData = {
    labels: ytdMonths,
    datasets: [
      {
        label: 'Budget',
        data: ytdMonths.map(month => data[month]?.target || 0),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1
      },
      {
        label: 'Invoice Value',
        data: ytdMonths.map(month => data[month]?.invoiceValue || 0),
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 1
      },
      {
        label: 'Order Value',
        data: ytdMonths.map(month => data[month]?.orderValue || 0),
        backgroundColor: 'rgba(245, 158, 11, 0.5)',
        borderColor: 'rgb(245, 158, 11)',
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
        text: 'YTD Performance',
        color: '#1f2937',
        font: {
          size: 16,
          weight: 'bold'
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: number) => {
            return new Intl.NumberFormat('en-ZA', {
              style: 'currency',
              currency: 'ZAR',
              maximumFractionDigits: 0
            }).format(value);
          }
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

export default YearToDateGraph;