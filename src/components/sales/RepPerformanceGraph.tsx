import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LineController,
  BarController
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { MonthlyBudget } from '../../types/budget';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  LineController,
  BarController,
  Title,
  Tooltip,
  Legend
);

interface RepPerformanceGraphProps {
  data: Record<string, MonthlyBudget>;
  repName: string;
}

const MONTHS = [
  'March', 'April', 'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December', 'January', 'February'
];

const RepPerformanceGraph: React.FC<RepPerformanceGraphProps> = ({ data, repName }) => {
  const monthlyValues = MONTHS.map(month => data[month] || { target: 0, invoiceValue: 0, orderValue: 0 });

  const chartData = {
    labels: MONTHS.map(month => `${month} ${month === 'January' || month === 'February' ? '2025' : '2024'}`),
    datasets: [
      {
        type: 'bar' as const,
        label: 'Monthly Target',
        data: monthlyValues.map(m => m.target),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1
      },
      {
        type: 'bar' as const,
        label: 'Invoice Value',
        data: monthlyValues.map(m => m.invoiceValue),
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 1
      },
      {
        type: 'bar' as const,
        label: 'Order Value',
        data: monthlyValues.map(m => m.orderValue),
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
        labels: {
          boxWidth: 20,
          padding: 10,
          font: {
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: `${repName}'s YTD Performance (Mar 2024 - Feb 2025)`,
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
            return `${context.dataset.label}: ${new Intl.NumberFormat('en-ZA', {
              style: 'currency',
              currency: 'ZAR',
              maximumFractionDigits: 0
            }).format(value)}`;
          }
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
              maximumFractionDigits: 0,
              notation: 'compact'
            }).format(value);
          }
        }
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="h-[400px]">
        <Chart type="bar" data={chartData} options={options} />
      </div>
    </div>
  );
};

export default RepPerformanceGraph;