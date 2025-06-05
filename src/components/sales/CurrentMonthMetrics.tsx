import React from 'react';
import { Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MonthlyBudget } from '../../types/budget';

interface RepMetricsProps {
  name: string;
  repId: string;
  data: MonthlyBudget;
}

const RepMetrics: React.FC<RepMetricsProps> = ({ name, repId, data }) => {
  const navigate = useNavigate();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const getViewDetailsPath = (repId: string) => {
    if (repId === 'franco') {
      return `/sales-accounts/franco/ytd`;
    }
    return `/sales/${repId}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base md:text-lg font-semibold text-gray-900">{name}'s Sales Dashboard</h3>
        <button
          onClick={() => navigate(getViewDetailsPath(repId))}
          className="flex items-center gap-2 px-2 md:px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <Eye className="w-4 h-4" />
          <span className="hidden md:inline">View Details</span>
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
        <div className="bg-blue-50 p-3 md:p-4 rounded-lg">
          <p className="text-sm text-blue-600 font-medium">Target</p>
          <p className="text-base md:text-lg font-bold text-blue-900">{formatCurrency(data.target)}</p>
        </div>
        <div className="bg-green-50 p-3 md:p-4 rounded-lg">
          <p className="text-sm text-green-600 font-medium">Invoice Value</p>
          <p className="text-base md:text-lg font-bold text-green-900">{formatCurrency(data.invoiceValue)}</p>
        </div>
        <div className="bg-orange-50 p-3 md:p-4 rounded-lg">
          <p className="text-sm text-orange-600 font-medium">Order Value</p>
          <p className="text-base md:text-lg font-bold text-orange-900">{formatCurrency(data.orderValue)}</p>
        </div>
      </div>
    </div>
  );
};

interface CurrentMonthMetricsProps {
  accounts: {
    franco: { monthlyData: Record<string, MonthlyBudget> };
    freek: { monthlyData: Record<string, MonthlyBudget> };
    jeckie: { monthlyData: Record<string, MonthlyBudget> };
    cod: { monthlyData: Record<string, MonthlyBudget> };
    inHouse: { monthlyData: Record<string, MonthlyBudget> };
  };
}

const CurrentMonthMetrics: React.FC<CurrentMonthMetricsProps> = ({ accounts }) => {
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });

  return (
    <div>
      <h2 className="text-lg md:text-xl font-bold bg-gray-100 text-gray-800 mb-4 p-3 md:p-4 rounded-lg">
        Current Month Performance
      </h2>
      <div className="grid grid-cols-1 gap-4 md:gap-6">
        {Object.entries({
          franco: 'Franco',
          freek: 'Freek',
          jeckie: 'Jeckie',
          cod: 'COD',
          inHouse: 'In-House Client'
        }).map(([id, name]) => (
          <RepMetrics
            key={id}
            name={name}
            repId={id}
            data={accounts[id as keyof typeof accounts].monthlyData[currentMonth] || { target: 0, invoiceValue: 0, orderValue: 0 }}
          />
        ))}
      </div>
    </div>
  );
};

export default CurrentMonthMetrics;