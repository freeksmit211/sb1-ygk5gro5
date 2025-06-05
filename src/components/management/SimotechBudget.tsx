import React from 'react';
import { MonthlyBudget } from '../../types/budget';

interface SimotechBudgetProps {
  year: number;
  monthlyData: Record<string, MonthlyBudget>;
  onDataChange: (month: string, data: MonthlyBudget) => void;
  onSave: () => void;
}

const SimotechBudget: React.FC<SimotechBudgetProps> = ({
  year,
  monthlyData,
  onDataChange,
  onSave,
}) => {
  const currentYearData = monthlyData[year.toString()] || { target: 0, invoiceValue: 0, orderValue: 0 };

  const handleChange = (field: keyof MonthlyBudget, value: string) => {
    onDataChange(year.toString(), {
      ...currentYearData,
      [field]: parseFloat(value) || 0
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg mb-8">
      <div className="bg-blue-600 text-white px-6 py-4 rounded-t-lg">
        <h2 className="text-xl font-bold">Simotech Yearly Budget</h2>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4 px-4 py-2">
          <div className="font-medium text-gray-700 flex items-center">{year}</div>
          <input
            type="number"
            value={currentYearData.target || ''}
            onChange={(e) => handleChange('target', e.target.value)}
            className="px-3 py-2 border rounded-lg"
            placeholder="Target"
          />
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={onSave}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save Yearly Budget
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimotechBudget;