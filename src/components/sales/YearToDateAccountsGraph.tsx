import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { YearlyBudget } from '../../types/budget';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

interface YearToDateAccountsGraphProps {
  budget: YearlyBudget;
}

const MONTHS = [
  'March', 'April', 'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December', 'January', 'February'
];

const YearToDateAccountsGraph: React.FC<YearToDateAccountsGraphProps> = ({ budget }) => {
  // Calculate monthly totals across all accounts
  const monthlyTotals = MONTHS.map(month => {
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

  // Calculate cumulative YTD values
  const cumulativeTarget = monthlyTotals.reduce((acc, curr, index) => {
    acc[index] = (acc[index - 1] || 0) + curr.target;
    return acc;
  }, [] as number[]);

  const cumulativeInvoice = monthlyTotals.reduce((acc, curr, index) => {
    acc[index] = (acc[index - 1] || 0) + curr.invoiceValue;
    return acc;
  }, [] as number[]);

  const cumulativeOrder = monthlyTotals.reduce((acc, curr, index) => {
    acc[index] = (acc[index - 1] || 0) + curr.orderValue;
    return acc;
  }, [] as number[]);

  const chartData = {
    labels: MONTHS.map(month => `${month} ${month === 'January' || month === 'February' ? '2025' : '2024'}`),
    datasets: [
      {
        type: 'line' as const,
        label: 'Cumulative Target',
        data: cumulativeTarget,
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        borderWidth: 2,
        fill: false,
        tension: 0.1,
        yAxisID: 'y1'
      },
      {
        type: 'line' as const,
        label: 'Cumulative Invoice Value',
        data: cumulativeInvoice,
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        borderWidth: 2,
        fill: false,
        tension: 0.1,
        yAxisID: 'y1'
      },
      {
        type: 'line' as const,
        label: 'Cumulative Order Value',
        data: cumulativeOrder,
        borderColor: 'rgb(245, 158, 11)',
        backgroundColor: 'rgba(245, 158, 11, 0.5)',
        borderWidth: 2,
        fill: false,
        tension: 0.1,
        yAxisID: 'y1'
      },
      {
        type: 'bar' as const,
        label: 'Monthly Target',
        data: monthlyTotals.map(m => m.target),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
        yAxisID: 'y'
      },
      {
        type: 'bar' as const,
        label: 'Invoice Value',
        data: monthlyTotals.map(m => m.invoiceValue),
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 1,
        yAxisID: 'y'
      },
      {
        type: 'bar' as const,
        label: 'Order Value',
        data: monthlyTotals.map(m => m.orderValue),
        backgroundColor: 'rgba(245, 158, 11, 0.5)',
        borderColor: 'rgb(245, 158, 11)',
        borderWidth: 1,
        yAxisID: 'y'
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
        text: 'Financial Year Performance (Mar 2024 - Feb 2025)',
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
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Monthly Values'
        },
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
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Cumulative YTD'
        },
        ticks: {
          callback: (value: number) => {
            return new Intl.NumberFormat('en-ZA', {
              style: 'currency',
              currency: 'ZAR',
              maximumFractionDigits: 0,
              notation: 'compact'
            }).format(value);
          }
        },
        grid: {
          drawOnChartArea: false
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

export default YearToDateAccountsGraph;