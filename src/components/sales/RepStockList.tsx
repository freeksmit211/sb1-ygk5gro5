import React from 'react';
import { StockItem } from '../../types/stock';
import { Package, Building2, User, Clock } from 'lucide-react';

interface RepStockListProps {
  items: StockItem[];
}

const RepStockList: React.FC<RepStockListProps> = ({ items }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Package className="w-12 h-12 mx-auto mb-2 text-gray-400" />
        <p>No stock items available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map(item => (
        <div key={item.id} className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{item.itemName}</h3>
            <span className="px-2 py-1 text-sm rounded-full bg-green-100 text-green-800">
              {item.quantity} units
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{item.clientName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                <span>{item.clientCompany}</span>
              </div>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              {item.notes && <p className="text-gray-500">{item.notes}</p>}
              <div className="flex items-center gap-2 text-gray-400">
                <Clock className="w-4 h-4" />
                <span>{formatDate(item.submittedAt)}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RepStockList;