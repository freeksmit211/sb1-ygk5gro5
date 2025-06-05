import React from 'react';
import { DollarSign, TrendingUp, Target, AlertTriangle, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useYearlyBudget } from '../hooks/useYearlyBudget';
import { useAuth } from '../contexts/AuthContext';
import { SALES_REP_NAMES, SalesRepCode, REP_CODE_TO_ID } from '../types/salesRep';

const SalesAccounts: React.FC = () => {
  const { budget, loading, error } = useYearlyBudget();
  const { user } = useAuth();
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });

  // Function to check if user can view specific rep overview
  const canViewRepOverview = (repId: string) => {
    if (user?.role === 'superAdmin' || user?.role === 'management') {
      return true;
    }

    switch (repId) {
      case 'franco':
        return user?.role === 'salesFranco';
      case 'freek':
        return user?.role === 'salesFreek';
      case 'jeckie':
        return user?.role === 'salesJeckie';
      default:
        return true;
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !budget) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-900 font-medium mb-4">{error || 'No budget data available'}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Calculate collective performance for current month
  const collectivePerformance = Object.values(budget.accounts).reduce(
    (acc, account) => {
      const monthData = account.monthlyData[currentMonth] || { target: 0, invoiceValue: 0, orderValue: 0 };
      return {
        target: acc.target + monthData.target,
        invoiceValue: acc.invoiceValue + monthData.invoiceValue,
        orderValue: acc.orderValue + monthData.orderValue
      };
    },
    { target: 0, invoiceValue: 0, orderValue: 0 }
  );

  const collectiveAchievement = collectivePerformance.target > 0 
    ? (collectivePerformance.invoiceValue / collectivePerformance.target * 100) 
    : 0;

  // Get account names and codes
  const accounts = [
    ...Object.entries(SALES_REP_NAMES).map(([code, name]) => ({
      id: REP_CODE_TO_ID[code as SalesRepCode],
      name,
      code
    })),
    { id: 'inHouse', name: 'In-House', code: 'IH' },
    { id: 'cod', name: 'COD', code: 'COD' }
  ];

  // Filter accounts based on user permissions
  const filteredAccounts = accounts.filter(account => canViewRepOverview(account.id));

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-white mb-6">Sales Accounts</h1>

      {/* Collective Performance */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Current Month Collective Performance</h2>
          <Link
            to="/sales-accounts/ytd"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <span>View Year to Date</span>
            <Eye className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Total Target</h3>
            </div>
            <p className="text-2xl font-bold text-blue-600">{formatCurrency(collectivePerformance.target)}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-gray-900">Total Invoice Value</h3>
            </div>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(collectivePerformance.invoiceValue)}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              <h3 className="font-semibold text-gray-900">Total Order Value</h3>
            </div>
            <p className="text-2xl font-bold text-orange-600">{formatCurrency(collectivePerformance.orderValue)}</p>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">Collective Achievement</span>
            <span className={`px-2 py-1 text-sm rounded-full ${
              collectiveAchievement >= 100 ? 'bg-green-100 text-green-800' :
              collectiveAchievement >= 75 ? 'bg-blue-100 text-blue-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {collectiveAchievement.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                collectiveAchievement >= 100 ? 'bg-green-600' :
                collectiveAchievement >= 75 ? 'bg-blue-600' :
                'bg-yellow-600'
              }`}
              style={{ width: `${Math.min(collectiveAchievement, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Individual Account Cards */}
      <div className="grid gap-6">
        {filteredAccounts.map(({ id, name, code }) => {
          const account = budget.accounts[id as keyof typeof budget.accounts];
          const monthData = account.monthlyData[currentMonth] || { target: 0, invoiceValue: 0, orderValue: 0 };
          const achievement = monthData.target > 0 ? (monthData.invoiceValue / monthData.target * 100) : 0;

          return (
            <div key={id} className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {name} {code !== 'IH' && code !== 'COD' && `(${code})`}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">Current Month Performance</p>
                </div>
                <Link
                  to={`/sales-accounts/${id}/ytd`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Eye className="w-5 h-5" />
                  <span>View Year to Date</span>
                </Link>
              </div>

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
          );
        })}
      </div>
    </div>
  );
};

export default SalesAccounts;