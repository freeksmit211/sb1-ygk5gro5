import React from 'react';
import { YearlyBudget } from '../../types/budget';

interface QuarterlyMetricsProps {
  budget: YearlyBudget;
}

const QuarterlyMetrics: React.FC<QuarterlyMetricsProps> = ({ budget }) => {
  const getLastThreeMonths = () => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
                   'July', 'August', 'September', 'October', 'November', 'December'];
    const currentMonthIndex = new Date().getMonth();
    return [2, 1, 0].map(offset => {
      const index = (currentMonthIndex - offset + 12) % 12;
      return months[index];
    });
  };

  const lastThreeMonths = getLastThreeMonths();

  const monthlyTotals = lastThreeMonths.map(month => {
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
      {lastThreeMonths.map((month, index) => (
        <div key={month} className="bg-white rounded-lg shadow-lg p-4 md:p-6">
          <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">{month}</h3>
          <div className="space-y-3 md:space-y-4">
            <div>
              <p className="text-sm text-gray-500">Target</p>
              <p className="text-lg md:text-xl font-bold text-blue-600">{formatCurrency(monthlyTotals[index].target)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Invoice Value</p>
              <p className="text-lg md:text-xl font-bold text-green-600">{formatCurrency(monthlyTotals[index].invoiceValue)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Order Value</p>
              <p className="text-lg md:text-xl font-bold text-orange-600">{formatCurrency(monthlyTotals[index].orderValue)}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuarterlyMetrics;