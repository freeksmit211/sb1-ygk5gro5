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
import { Chart } from 'react-chartjs-2';
import { YearlyBudget, MonthlyBudget } from '../../types/budget';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface CollectivePerformanceGraphProps {
  budget: YearlyBudget;
  simotechBudget: MonthlyBudget | null;
}

const MONTHS = [
  'March', 'April', 'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December', 'January', 'February'
];

const CollectivePerformanceGraph: React.FC<CollectivePerformanceGraphProps> = ({ 
  budget,
  simotechBudget 
}) => {
  const collectiveValues = MONTHS.map(month => {
    return Object.values(budget.accounts).reduce(
      (acc, account) => {
        const monthData = account.monthlyData[month] || { target: 0, invoiceValue: 0, orderValue: 0 };
        return {
          target: acc.target + (monthData.target || 0),
          invoiceValue: acc.invoiceValue + (monthData.invoiceValue || 0),
          orderValue: acc.orderValue + (monthData.orderValue || 0)
        };
      },
      { target: 0, invoiceValue: 0, orderValue: 0 }
    );
  });

  const chartData = {
    labels: MONTHS.map(month => `${month.slice(0, 3)} ${month === 'January' || month === 'February' ? '25' : '24'}`),
    datasets: [
      {
        type: 'bar' as const,
        label: 'Monthly Budget',
        data: collectiveValues.map(v => v.target),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1
      },
      {
        type: 'bar' as const,
        label: 'Invoice Value',
        data: collectiveValues.map(v => v.invoiceValue),
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 1
      },
      {
        type: 'bar' as const,
        label: 'Order Value',
        data: collectiveValues.map(v => v.orderValue),
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
        text: 'Financial Year Performance (Mar 2024 - Feb 2025)',
        color: '#1f2937',
        font: {
          size: 14,
          weight: 'bold'
        },
        padding: { bottom: 15 }
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
      x: {
        ticks: {
          font: {
            size: 11
          }
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            size: 11
          },
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
    <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
      <div className="h-[300px] md:h-[400px]">
        <Chart type="bar" data={chartData} options={options} />
      </div>
      {simotechBudget && (
        <div className="mt-4 text-xs md:text-sm text-gray-600 space-y-1">
          <p>Yearly Simotech Budget: {new Intl.NumberFormat('en-ZA', {
            style: 'currency',
            currency: 'ZAR',
            maximumFractionDigits: 0
          }).format(simotechBudget.target)}</p>
          <p>Monthly Target: {new Intl.NumberFormat('en-ZA', {
            style: 'currency',
            currency: 'ZAR',
            maximumFractionDigits: 0
          }).format(simotechBudget.target / 12)}</p>
        </div>
      )}
    </div>
  );
};

export default CollectivePerformanceGraph;