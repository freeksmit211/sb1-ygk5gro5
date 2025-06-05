import React from 'react';
import { X } from 'lucide-react';
import { MonthlyBudget } from '../../types/budget';

interface DetailViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: Record<string, MonthlyBudget>;
}

const MONTHS = [
  'March', 'April', 'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December', 'January', 'February'
];

const DetailViewModal: React.FC<DetailViewModalProps> = ({
  isOpen,
  onClose,
  title,
  data
}) => {
  if (!isOpen) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR'
    }).format(value);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="px-6 py-4 bg-blue-600 flex justify-between items-center">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <button
            onClick={onClose}
            className="text-white hover:text-blue-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 overflow-auto max-h-[calc(90vh-80px)]">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left text-gray-600">Month</th>
                <th className="px-4 py-2 text-right text-gray-600">Target</th>
                <th className="px-4 py-2 text-right text-gray-600">Invoice Value</th>
                <th className="px-4 py-2 text-right text-gray-600">Order Value</th>
                <th className="px-4 py-2 text-right text-gray-600">Commission</th>
              </tr>
            </thead>
            <tbody>
              {MONTHS.map(month => {
                const monthData = data[month] || { target: 0, invoiceValue: 0, orderValue: 0 };
                const commission = monthData.invoiceValue * 0.01;
                
                return (
                  <tr key={month} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-900">
                      {month} {month === 'January' || month === 'February' ? '2025' : '2024'}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-900">{formatCurrency(monthData.target)}</td>
                    <td className="px-4 py-3 text-right text-gray-900">{formatCurrency(monthData.invoiceValue)}</td>
                    <td className="px-4 py-3 text-right text-gray-900">{formatCurrency(monthData.orderValue)}</td>
                    <td className="px-4 py-3 text-right text-gray-900">{formatCurrency(commission)}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-gray-50 font-semibold">
              <tr>
                <td className="px-4 py-3">Total</td>
                <td className="px-4 py-3 text-right">
                  {formatCurrency(MONTHS.reduce((sum, month) => sum + (data[month]?.target || 0), 0))}
                </td>
                <td className="px-4 py-3 text-right">
                  {formatCurrency(MONTHS.reduce((sum, month) => sum + (data[month]?.invoiceValue || 0), 0))}
                </td>
                <td className="px-4 py-3 text-right">
                  {formatCurrency(MONTHS.reduce((sum, month) => sum + (data[month]?.orderValue || 0), 0))}
                </td>
                <td className="px-4 py-3 text-right">
                  {formatCurrency(MONTHS.reduce((sum, month) => sum + ((data[month]?.invoiceValue || 0) * 0.01), 0))}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DetailViewModal;