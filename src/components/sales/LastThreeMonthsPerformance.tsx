import React from 'react';
import { YearlyBudget } from '../../types/budget';
import { DollarSign, Target, TrendingUp } from 'lucide-react';

interface LastThreeMonthsPerformanceProps {
  budget: YearlyBudget;
}

const LastThreeMonthsPerformance: React.FC<LastThreeMonthsPerformanceProps> = ({ budget }) => {
  const getLastThreeMonths = () => {
    const months = [];
    for (let i = 2; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      months.push(date.toLocaleString('default', { month: 'long' }));
    }
    return months;
  };

  const lastThreeMonths = getLastThreeMonths();

  const calculateMonthTotals = (month: string) => {
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
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Last 3 Months Performance</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {lastThreeMonths.map(month => {
          const totals = calculateMonthTotals(month);
          const achievement = totals.target > 0 ? (totals.invoiceValue / totals.target * 100) : 0;

          return (
            <div key={month} className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{month}</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-600">Target</span>
                  </div>
                  <span className="font-medium text-blue-600">{formatCurrency(totals.target)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-600">Invoice Value</span>
                  </div>
                  <span className="font-medium text-green-600">{formatCurrency(totals.invoiceValue)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-orange-600" />
                    <span className="text-sm text-gray-600">Order Value</span>
                  </div>
                  <span className="font-medium text-orange-600">{formatCurrency(totals.orderValue)}</span>
                </div>

                <div className="pt-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">Achievement</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      achievement >= 100 ? 'bg-green-100 text-green-800' :
                      achievement >= 75 ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {achievement.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        achievement >= 100 ? 'bg-green-600' :
                        achievement >= 75 ? 'bg-blue-600' :
                        'bg-yellow-600'
                      }`}
                      style={{ width: `${Math.min(achievement, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LastThreeMonthsPerformance;