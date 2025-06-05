import React, { useState } from 'react';
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
import { ChevronDown } from 'lucide-react';

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

interface CollectivePerformanceGraphProps {
  budget: YearlyBudget;
}

const MONTHS = [
  'March', 'April', 'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December', 'January', 'February'
];

const CollectivePerformanceGraph: React.FC<CollectivePerformanceGraphProps> = ({ budget }) => {
  const [selectedYear, setSelectedYear] = useState(2025);
  const [showYearSelector, setShowYearSelector] = useState(false);

  // Calculate monthly totals across all accounts
  const getMonthlyTotals = (year: number) => {
    return MONTHS.map(month => {
      // Only show real data for March 2025
      if (year === 2025 && month !== 'March') {
        return { target: 0, invoiceValue: 0, orderValue: 0 };
      }

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
  };

  // Calculate cumulative YTD values
  const calculateCumulativeValues = (monthlyTotals: any[]) => {
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

    return { cumulativeTarget, cumulativeInvoice, cumulativeOrder };
  };

  const currentYearTotals = getMonthlyTotals(selectedYear);
  const currentYearCumulative = calculateCumulativeValues(currentYearTotals);
  const previousYearTotals = getMonthlyTotals(selectedYear - 1);
  const previousYearCumulative = calculateCumulativeValues(previousYearTotals);

  const chartOptions = {
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
        text: `YTD Performance (Mar ${selectedYear} - Feb ${selectedYear + 1})`,
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

  const createChartData = (monthlyTotals: any[], cumulative: any, year: number) => ({
    labels: MONTHS.map(month => `${month} ${month === 'January' || month === 'February' ? year + 1 : year}`),
    datasets: [
      {
        type: 'line' as const,
        label: 'Cumulative Target',
        data: cumulative.cumulativeTarget,
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
        data: cumulative.cumulativeInvoice,
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
        data: cumulative.cumulativeOrder,
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
  });

  const currentYearData = createChartData(currentYearTotals, currentYearCumulative, selectedYear);
  const previousYearData = createChartData(previousYearTotals, previousYearCumulative, selectedYear - 1);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="h-[400px]">
          <Chart type="bar" data={currentYearData} options={chartOptions} />
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Previous Year Comparison</h3>
          <div className="relative">
            <button
              onClick={() => setShowYearSelector(!showYearSelector)}
              className="flex items-center gap-2 px-4 py-2 bg-white text-gray-900 rounded-lg border border-gray-200 hover:bg-gray-50"
            >
              <span>Financial Year {selectedYear - 1}/{selectedYear}</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {showYearSelector && (
              <div className="absolute top-full right-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                {[2025, 2024, 2023].map(year => (
                  <button
                    key={year}
                    onClick={() => {
                      setSelectedYear(year);
                      setShowYearSelector(false);
                    }}
                    className={`w-full px-4 py-2 text-left hover:bg-gray-50 ${
                      selectedYear === year ? 'bg-blue-50 text-blue-600' : 'text-gray-900'
                    }`}
                  >
                    Financial Year {year - 1}/{year}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="h-[400px]">
          <Chart 
            type="bar" 
            data={previousYearData} 
            options={{
              ...chartOptions,
              plugins: {
                ...chartOptions.plugins,
                title: {
                  ...chartOptions.plugins.title,
                  text: `YTD Performance (Mar ${selectedYear - 1} - Feb ${selectedYear})`
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CollectivePerformanceGraph;