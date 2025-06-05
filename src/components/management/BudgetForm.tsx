import React from 'react';
import { MonthlyBudget } from '../../types/budget';

interface BudgetFormProps {
  month: string;
  data: MonthlyBudget;
  onChange: (month: string, data: MonthlyBudget) => void;
}

const BudgetForm: React.FC<BudgetFormProps> = ({ month, data, onChange }) => {
  const handleChange = (field: keyof MonthlyBudget, value: string) => {
    onChange(month, {
      ...data,
      [field]: parseFloat(value) || 0
    });
  };

  return (
    <div className="grid grid-cols-3 gap-4 p-4 border-b">
      <div className="font-medium text-gray-700 flex items-center">
        <select 
          value={month} 
          onChange={(e) => onChange(e.target.value, data)}
          className="w-full px-3 py-2 border rounded-lg bg-white"
        >
          {[
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
          ].map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>
      <div className="col-span-2 grid grid-cols-3 gap-4">
        <input
          type="number"
          value={data.target || ''}
          onChange={(e) => handleChange('target', e.target.value)}
          placeholder="Target"
          className="px-3 py-2 border rounded-lg"
        />
        <input
          type="number"
          value={data.invoiceValue || ''}
          onChange={(e) => handleChange('invoiceValue', e.target.value)}
          placeholder="Invoice Value"
          className="px-3 py-2 border rounded-lg"
        />
        <input
          type="number"
          value={data.orderValue || ''}
          onChange={(e) => handleChange('orderValue', e.target.value)}
          placeholder="Order Value"
          className="px-3 py-2 border rounded-lg"
        />
      </div>
    </div>
  );
};

export default BudgetForm;