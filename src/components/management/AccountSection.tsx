import React from 'react';
import { AccountBudget, MonthlyBudget } from '../../types/budget';
import BudgetForm from './BudgetForm';

interface AccountSectionProps {
  title: string;
  data: AccountBudget;
  onChange: (accountName: string, monthlyData: Record<string, MonthlyBudget>) => void;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const AccountSection: React.FC<AccountSectionProps> = ({ title, data, onChange }) => {
  const handleMonthChange = (month: string, monthData: MonthlyBudget) => {
    onChange(data.name, {
      ...data.monthlyData,
      [month]: monthData
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg mb-6">
      <div className="bg-blue-600 text-white px-6 py-4 rounded-t-lg">
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-3 gap-4 px-4 py-2 bg-gray-50 rounded-t-lg">
          <div className="font-semibold text-gray-600">Month</div>
          <div className="col-span-2 grid grid-cols-3 gap-4">
            <div className="font-semibold text-gray-600">Target</div>
            <div className="font-semibold text-gray-600">Invoice Value</div>
            <div className="font-semibold text-gray-600">Order Value</div>
          </div>
        </div>
        {MONTHS.map(month => (
          <BudgetForm
            key={month}
            month={month}
            data={data.monthlyData[month] || { target: 0, invoiceValue: 0, orderValue: 0 }}
            onChange={handleMonthChange}
          />
        ))}
      </div>
    </div>
  );
};

export default AccountSection;