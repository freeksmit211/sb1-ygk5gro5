import React from 'react';

interface SalesMetricProps {
  title: string;
  value: number;
  format?: 'currency' | 'number' | 'percentage';
}

const SalesMetric: React.FC<SalesMetricProps> = ({ title, value, format = 'number' }) => {
  const formatValue = (value: number): string => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-ZA', {
          style: 'currency',
          currency: 'ZAR',
          maximumFractionDigits: 0
        }).format(value);
      case 'percentage':
        return `${value.toFixed(1)}%`;
      default:
        return value.toLocaleString();
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
      <p className="text-2xl font-semibold text-gray-900">{formatValue(value)}</p>
    </div>
  );
};

export default SalesMetric;