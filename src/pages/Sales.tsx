import React from 'react';
import { AlertTriangle, TrendingUp, DollarSign, Target } from 'lucide-react';
import { useYearlyBudget } from '../hooks/useYearlyBudget';
import LastThreeMonthsPerformance from '../components/sales/LastThreeMonthsPerformance';
import CurrentMonthGraph from '../components/sales/CurrentMonthGraph';

const Sales: React.FC = () => {
  const { budget, loading, error } = useYearlyBudget();
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear();

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-600 p-4 md:p-6 flex justify-center items-start pt-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!budget) {
    return (
      <div className="min-h-screen bg-blue-600 p-4 md:p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <p className="text-gray-900 font-medium">No budget data available</p>
        </div>
      </div>
    );
  }

  // Calculate totals for current month
  const totals = Object.values(budget.accounts).reduce((acc, account) => {
    const monthData = account.monthlyData[currentMonth] || { target: 0, invoiceValue: 0, orderValue: 0 };
    return {
      target: acc.target + (monthData.target || 0),
      invoiceValue: acc.invoiceValue + (monthData.invoiceValue || 0),
      orderValue: acc.orderValue + (monthData.orderValue || 0)
    };
  }, { target: 0, invoiceValue: 0, orderValue: 0 });

  const achievementPercentage = totals.target > 0 
    ? (totals.invoiceValue / totals.target) * 100 
    : 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-blue-600 p-4 md:p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-white">Sales Overview</h1>
        <h2 className="text-lg text-blue-100">{currentMonth} {currentYear} Performance</h2>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600">Monthly Target</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(totals.target)}</p>
            </div>
            <Target className="w-8 h-8 text-blue-600" />
          </div>
          <div className="text-sm text-gray-500">Current month goal</div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600">Invoice Value</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{formatCurrency(totals.invoiceValue)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
          <div className="text-sm text-gray-500">Total invoiced this month</div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600">Order Value</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">{formatCurrency(totals.orderValue)}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-600" />
          </div>
          <div className="text-sm text-gray-500">Total orders this month</div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600">Achievement</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">{achievementPercentage.toFixed(1)}%</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm ${
              achievementPercentage >= 100 ? 'bg-green-100 text-green-800' :
              achievementPercentage >= 75 ? 'bg-blue-100 text-blue-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {achievementPercentage >= 100 ? 'Achieved' :
               achievementPercentage >= 75 ? 'On Track' : 'In Progress'}
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                achievementPercentage >= 100 ? 'bg-green-600' :
                achievementPercentage >= 75 ? 'bg-blue-600' :
                'bg-yellow-600'
              }`}
              style={{ width: `${Math.min(achievementPercentage, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Last Three Months Performance */}
      <LastThreeMonthsPerformance budget={budget} />

      {/* January 2025 Performance Graph */}
      <CurrentMonthGraph budget={budget} />
    </div>
  );
};

export default Sales;