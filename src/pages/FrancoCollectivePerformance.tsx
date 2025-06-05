import React from 'react';
import { ArrowLeft, TrendingUp, DollarSign, Target, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useYearlyBudget } from '../hooks/useYearlyBudget';
import LastThreeMonthsPerformance from '../components/sales/LastThreeMonthsPerformance';
import CurrentMonthGraph from '../components/sales/CurrentMonthGraph';

const FrancoCollectivePerformance: React.FC = () => {
  const navigate = useNavigate();
  const { budget, loading } = useYearlyBudget();
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

  if (!budget || !budget.accounts.franco) {
    return (
      <div className="min-h-screen bg-blue-600 p-4 md:p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <p className="text-gray-900 font-medium">No budget data available</p>
        </div>
      </div>
    );
  }

  const francoData = budget.accounts.franco.monthlyData[currentMonth] || {
    target: 0,
    invoiceValue: 0,
    orderValue: 0
  };

  const achievementPercentage = francoData.target > 0 
    ? (francoData.invoiceValue / francoData.target) * 100 
    : 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Create a modified budget object with only Franco's data
  const francoBudget = {
    year: budget.year,
    accounts: {
      franco: budget.accounts.franco
    }
  };

  return (
    <div className="min-h-screen bg-blue-600 p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white hover:text-blue-100"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white">Franco's Overview</h1>
          <h2 className="text-lg text-blue-100">{currentMonth} {currentYear} Performance</h2>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600">Monthly Target</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(francoData.target)}</p>
            </div>
            <Target className="w-8 h-8 text-blue-600" />
          </div>
          <div className="text-sm text-gray-500">Current month goal</div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600">Invoice Value</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{formatCurrency(francoData.invoiceValue)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
          <div className="text-sm text-gray-500">Total invoiced this month</div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600">Order Value</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">{formatCurrency(francoData.orderValue)}</p>
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
      <LastThreeMonthsPerformance budget={francoBudget} />

      {/* Performance Graph */}
      <CurrentMonthGraph budget={francoBudget} />
    </div>
  );
};

export default FrancoCollectivePerformance;