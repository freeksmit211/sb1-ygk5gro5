import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, DollarSign, Target, Award } from 'lucide-react';
import { useYearlyBudget } from '../hooks/useYearlyBudget';
import LastThreeMonthsPerformance from '../components/sales/LastThreeMonthsPerformance';
import RepPerformanceGraph from '../components/sales/RepPerformanceGraph';

const ACCOUNT_NAMES = {
  freek: 'Freek',
  jeckie: 'Jeckie',
  inHouse: 'In-House',
  cod: 'COD'
};

const AccountYearToDate: React.FC = () => {
  const { accountId } = useParams<{ accountId: string }>();
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

  if (!budget || !accountId || !budget.accounts[accountId as keyof typeof budget.accounts]) {
    return (
      <div className="min-h-screen bg-blue-600 p-4 md:p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <p className="text-gray-900 font-medium">No budget data available</p>
        </div>
      </div>
    );
  }

  const accountData = budget.accounts[accountId as keyof typeof budget.accounts];
  const monthData = accountData.monthlyData[currentMonth] || {
    target: 0,
    invoiceValue: 0,
    orderValue: 0
  };

  const achievementPercentage = monthData.target > 0 
    ? (monthData.invoiceValue / monthData.target) * 100 
    : 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Create a modified budget object with only this account's data
  const accountBudget = {
    year: budget.year,
    accounts: {
      [accountId]: accountData
    }
  };

  const accountName = ACCOUNT_NAMES[accountId as keyof typeof ACCOUNT_NAMES] || accountId;

  return (
    <div className="min-h-screen bg-blue-600 p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/sales-accounts')}
          className="text-white hover:text-blue-100"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white">{accountName}'s Overview</h1>
          <h2 className="text-lg text-blue-100">{currentMonth} {currentYear} Performance</h2>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600">Monthly Target</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(monthData.target)}</p>
            </div>
            <Target className="w-8 h-8 text-blue-600" />
          </div>
          <div className="text-sm text-gray-500">Current month goal</div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600">Invoice Value</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{formatCurrency(monthData.invoiceValue)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
          <div className="text-sm text-gray-500">Total invoiced this month</div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600">Order Value</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">{formatCurrency(monthData.orderValue)}</p>
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
            <Award className="w-8 h-8 text-purple-600" />
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
          <div className="flex justify-end mt-1">
            <span className={`px-2 py-0.5 text-xs rounded-full ${
              achievementPercentage >= 100 ? 'bg-green-100 text-green-800' :
              achievementPercentage >= 75 ? 'bg-blue-100 text-blue-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {achievementPercentage >= 100 ? 'Achieved' :
               achievementPercentage >= 75 ? 'On Track' : 'In Progress'}
            </span>
          </div>
        </div>
      </div>

      {/* Last Three Months Performance */}
      <LastThreeMonthsPerformance budget={accountBudget} />

      {/* Financial Year Performance Graph */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Financial Year Performance (Mar 2024 - Feb 2025)</h2>
        <RepPerformanceGraph data={accountData.monthlyData} repName={accountName} />
      </div>
    </div>
  );
};

export default AccountYearToDate;