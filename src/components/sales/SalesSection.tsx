import React, { useState } from 'react';
import { MonthlyBudget } from '../../types/budget';
import SalesMetric from './SalesMetric';
import DetailViewModal from './DetailViewModal';
import { Eye } from 'lucide-react';

interface SalesSectionProps {
  title: string;
  data: Record<string, MonthlyBudget>;
}

const SalesSection: React.FC<SalesSectionProps> = ({ title, data }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const monthData = data[currentMonth] || { target: 0, invoiceValue: 0, orderValue: 0 };
  const commission = monthData.invoiceValue * 0.01; // 1% commission

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-blue-600 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">{title}'s Account</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-3 py-1 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <Eye className="w-4 h-4" />
            View Details
          </button>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <SalesMetric
            title="Monthly Budget"
            value={monthData.target}
            format="currency"
          />
          <SalesMetric
            title="Invoice Value"
            value={monthData.invoiceValue}
            format="currency"
          />
          <SalesMetric
            title="Order Value"
            value={monthData.orderValue}
            format="currency"
          />
          <SalesMetric
            title="Commission Earned"
            value={commission}
            format="currency"
          />
        </div>
      </div>

      <DetailViewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`${title}'s Account Details`}
        data={data}
      />
    </>
  );
};

export default SalesSection;