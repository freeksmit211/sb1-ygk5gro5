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
import { YearlyBudget } from '../../types/budget';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface CurrentMonthGraphProps {
  budget: YearlyBudget;
}

// Financial year months (March to February)
const MONTHS = [
  'March', 'April', 'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December', 'January', 'February'
];

const CurrentMonthGraph: React.FC<CurrentMonthGraphProps> = ({ budget }) => {
  const monthlyValues = MONTHS.map(month => {
    return Object.values(budget.accounts).reduce(
      (acc, account) => {
        const monthData = account.monthlyData[month] || { target: 0, invoiceValue: 0, orderValue: 0 };
        return {
          target: acc.target + monthData.target,
          invoiceValue: acc.invoiceValue + monthData.invoiceValue,
          orderValue: acc.orderValue + monthData.orderValue
        };
      },
      { target: 0, invoiceValue: 0, orderValue: 0 }
    );
  });

  const chartData = {
    labels: MONTHS.map(month => `${month} ${month === 'January' || month === 'February' ? '2025' : '2024'}`),
    datasets: [
      {
        label: 'Target',
        data: monthlyValues.map(m => m.target),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1
      },
      {
        label: 'Invoice Value',
        data: monthlyValues.map(m => m.invoiceValue),
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 1
      },
      {
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
      },
      title: {
        display: true,
        text: 'YTD Performance (Mar 2024 - Feb 2025)',
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

  // Calculate yearly totals
  const yearlyTotals = monthlyValues.reduce(
    (acc, month) => ({
      target: acc.target + month.target,
      invoiceValue: acc.invoiceValue + month.invoiceValue,
      orderValue: acc.orderValue + month.orderValue
    }),
    { target: 0, invoiceValue: 0, orderValue: 0 }
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="h-[400px]">
        <Bar data={chartData} options={options} />
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
        <div className="text-blue-600">
          <span className="font-medium">Yearly Target:</span> {new Intl.NumberFormat('en-ZA', {
            style: 'currency',
            currency: 'ZAR',
            maximumFractionDigits: 0
          }).format(yearlyTotals.target)}
        </div>
        <div className="text-green-600">
          <span className="font-medium">Total Invoice Value:</span> {new Intl.NumberFormat('en-ZA', {
            style: 'currency',
            currency: 'ZAR',
            maximumFractionDigits: 0
          }).format(yearlyTotals.invoiceValue)}
        </div>
        <div className="text-orange-600">
          <span className="font-medium">Total Order Value:</span> {new Intl.NumberFormat('en-ZA', {
            style: 'currency',
            currency: 'ZAR',
            maximumFractionDigits: 0
          }).format(yearlyTotals.orderValue)}
        </div>
      </div>
    </div>
  );
};

export default CurrentMonthGraph;