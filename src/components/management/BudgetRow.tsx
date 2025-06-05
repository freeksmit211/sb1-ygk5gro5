import React from 'react';
import { Save } from 'lucide-react';
import { MonthlyBudget } from '../../types/budget';
import { SALES_REP_NAMES, ID_TO_REP_CODE } from '../../types/salesRep';

interface BudgetRowProps {
  title: string;
  month: string;
  data: MonthlyBudget;
  onMonthChange: (month: string) => void;
  onDataChange: (data: MonthlyBudget) => void;
  onSave: () => void;
  accountId: string;
}

const BudgetRow: React.FC<BudgetRowProps> = ({
  title,
  month,
  data,
  onMonthChange,
  onDataChange,
  onSave,
  accountId
}) => {
  const handleChange = (field: keyof MonthlyBudget, value: string) => {
    onDataChange({
      ...data,
      [field]: parseFloat(value) || 0
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Get rep code if this is a sales rep account
  const repCode = ID_TO_REP_CODE[accountId];
  const displayTitle = repCode ? `${SALES_REP_NAMES[repCode]} (${repCode})` : title;

  return (
    <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow">
      {/* Account Name */}
      <div className="w-48">
        <h3 className="font-semibold text-gray-900">{displayTitle}</h3>
      </div>

      {/* Month Selection */}
      <div className="w-48">
        <label className="block text-sm font-medium text-gray-500 mb-1">Month</label>
        <select 
          value={month} 
          onChange={(e) => onMonthChange(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg bg-white"
        >
          {[
            'March', 'April', 'May', 'June', 'July', 'August',
            'September', 'October', 'November', 'December', 'January', 'February'
          ].map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      {/* Target Input */}
      <div className="w-40">
        <label className="block text-sm font-medium text-gray-500 mb-1">Monthly Target</label>
        <input
          type="number"
          value={data.target || ''}
          onChange={(e) => handleChange('target', e.target.value)}
          placeholder="Target"
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>

      {/* Invoice Value Input */}
      <div className="w-40">
        <label className="block text-sm font-medium text-gray-500 mb-1">Invoice Value</label>
        <input
          type="number"
          value={data.invoiceValue || ''}
          onChange={(e) => handleChange('invoiceValue', e.target.value)}
          placeholder="Invoice Value"
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>

      {/* Order Value Input */}
      <div className="w-40">
        <label className="block text-sm font-medium text-gray-500 mb-1">Order Value</label>
        <input
          type="number"
          value={data.orderValue || ''}
          onChange={(e) => handleChange('orderValue', e.target.value)}
          placeholder="Order Value"
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>

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

export default BudgetRow;