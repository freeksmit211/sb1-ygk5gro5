import React from 'react';
import { Save } from 'lucide-react';
import { MonthlyBudget } from '../../types/budget';
import YearSelect from './YearSelect';

interface SimotechBudgetRowProps {
  year: number;
  data: MonthlyBudget;
  onDataChange: (data: MonthlyBudget) => void;
  onSave: () => void;
}

const SimotechBudgetRow: React.FC<SimotechBudgetRowProps> = ({
  year,
  data,
  onDataChange,
  onSave,
}) => {
  const handleChange = (value: string) => {
    onDataChange({
      ...data,
      target: parseFloat(value) || 0,
      invoiceValue: 0,
      orderValue: 0
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow">
      {/* Account Name */}
      <div className="w-48">
        <h3 className="font-semibold text-gray-900">Simotech Budget</h3>
      </div>

      {/* Year Selection */}
      <div className="w-48">
        <label className="block text-sm font-medium text-gray-500 mb-1">Financial Year</label>
        <YearSelect value={year} onChange={() => {}} />
      </div>

      {/* Target Input */}
      <div className="w-40">
        <label className="block text-sm font-medium text-gray-500 mb-1">Yearly Target</label>
        <input
          type="number"
          value={data.target || ''}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Target"
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>

      {/* Placeholder divs to maintain alignment */}
      <div className="w-40"></div>
      <div className="w-40"></div>

      {/* Save Button */}
      <button
        onClick={onSave}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 mt-6"
      >
        <Save className="w-4 h-4" />
        Save
      </button>
    </div>
  );
};

export default SimotechBudgetRow;