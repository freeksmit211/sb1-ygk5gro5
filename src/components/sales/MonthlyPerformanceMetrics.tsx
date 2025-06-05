import React from 'react';
import { MonthlyBudget } from '../../types/budget';

interface MonthlyMetricProps {
  label: string;
  value: string | number;
  className?: string;
}

const MonthlyMetric: React.FC<MonthlyMetricProps> = ({ label, value, className = '' }) => (
  <div className={`p-4 rounded-lg ${className}`}>
    <p className="text-sm font-medium opacity-80">{label}</p>
    <p className="text-lg font-bold mt-1">{value}</p>
  </div>
);

interface MonthPerformanceProps {
  month: string;
  data: MonthlyBudget;
}

const MonthPerformance: React.FC<MonthPerformanceProps> = ({ month, data }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const calculatePercentage = () => {
    if (!data.target) return 0;
    return ((data.invoiceValue / data.target) * 100).toFixed(1);
  };

  const calculateCommission = () => {
    return data.invoiceValue * 0.01; // 1% commission
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{month}</h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <MonthlyMetric
          label="Target"
          value={formatCurrency(data.target)}
          className="bg-blue-50 text-blue-900"
        />
        <MonthlyMetric
          label="Invoice Value"
          value={formatCurrency(data.invoiceValue)}
          className="bg-green-50 text-green-900"
        />
        <MonthlyMetric
          label="Order Value"
          value={formatCurrency(data.orderValue)}
          className="bg-orange-50 text-orange-900"
        />
        <MonthlyMetric
          label="Target Achievement"
          value={`${calculatePercentage()}%`}
          className="bg-purple-50 text-purple-900"
        />
        <MonthlyMetric
          label="Commission Earned"
          value={formatCurrency(calculateCommission())}
          className="bg-pink-50 text-pink-900"
        />
      </div>
    </div>
  );
};

interface MonthlyPerformanceMetricsProps {
  data: Record<string, MonthlyBudget>;
}

const MonthlyPerformanceMetrics: React.FC<MonthlyPerformanceMetricsProps> = ({ data }) => {
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  
  // Get previous two months
  const months = Array.from({ length: 3 }, (_, i) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    return date.toLocaleString('default', { month: 'long' });
  });

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold bg-gray-100 text-gray-800 p-4 rounded-lg">
        Recent Monthly Performance
      </h2>
      <div className="grid gap-6">
        {months.map(month => (
          <MonthPerformance
            key={month}
            month={month}
            data={data[month] || { target: 0, invoiceValue: 0, orderValue: 0 }}
          />
        ))}
      </div>
    </div>
  );
};

export default MonthlyPerformanceMetrics;