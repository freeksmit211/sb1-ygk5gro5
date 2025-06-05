import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Target, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';
import { useYearlyBudget } from '../hooks/useYearlyBudget';
import RepPerformanceGraph from '../components/sales/RepPerformanceGraph';
import MonthlyPerformanceMetrics from '../components/sales/MonthlyPerformanceMetrics';

const SalesAccountDetails: React.FC = () => {
  const { accountId } = useParams();
  const navigate = useNavigate();
  const { budget, loading, error } = useYearlyBudget();
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });

  if (loading) {
    return (
      <div className="p-6 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!budget || !accountId || !budget.accounts[accountId as keyof typeof budget.accounts]) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-900 font-medium">Account not found</p>
          <button
            onClick={() => navigate('/sales-accounts')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Accounts
          </button>
        </div>
      </div>
    );
  }

  const account = budget.accounts[accountId as keyof typeof budget.accounts];
  const monthData = account.monthlyData[currentMonth] || { target: 0, invoiceValue: 0, orderValue: 0 };
  const achievement = monthData.target > 0 ? (monthData.invoiceValue / monthData.target * 100) : 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/sales-accounts')}
          className="flex items-center gap-2 text-white hover:text-blue-100"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Accounts
        </button>
        <h1 className="text-2xl font-bold text-white capitalize">{account.name} Account Details</h1>
      </div>

      {/* Performance Graph */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Financial Year Performance</h2>
        <RepPerformanceGraph data={account.monthlyData} repName={account.name} />
      </div>

      {/* Current Month Performance */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Current Month Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Monthly Target</h3>
            </div>
            <p className="text-2xl font-bold text-blue-600">{formatCurrency(monthData.target)}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-gray-900">Invoice Value</h3>
            </div>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(monthData.invoiceValue)}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              <h3 className="font-semibold text-gray-900">Order Value</h3>
            </div>
            <p className="text-2xl font-bold text-orange-600">{formatCurrency(monthData.orderValue)}</p>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">Achievement</span>
            <span className={`px-2 py-1 text-sm rounded-full ${
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

      {/* Last 3 Months Performance */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Monthly Performance</h2>
        <MonthlyPerformanceMetrics data={account.monthlyData} />
      </div>
    </div>
  );
};

export default SalesAccountDetails;