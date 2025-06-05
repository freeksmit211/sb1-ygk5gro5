import React, { useState } from 'react';
import { StockItem } from '../../types/stock';
import { Package, Building2, User, Clock, Check } from 'lucide-react';
import StockItemModal from './StockItemModal';

interface StockListProps {
  items: StockItem[];
  onPickup?: (itemId: string) => Promise<void>;
}

const StockList: React.FC<StockListProps> = ({ items, onPickup }) => {
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null);

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
    <>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {items.map(item => (
          <div 
            key={item.id} 
            className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setSelectedItem(item)}
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{item.itemName}</h3>
              <span className="px-2 py-1 text-sm rounded-full bg-green-100 text-green-800">
                {item.quantity} units
              </span>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{item.clientName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                <span>{item.clientCompany}</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                <span>Assigned to {item.assignedTo}</span>
              </div>
              {item.notes && <p className="text-gray-500">{item.notes}</p>}
              <div className="flex items-center gap-2 text-gray-400">
                <Clock className="w-4 h-4" />
                <span>{formatDate(item.submittedAt)}</span>
              </div>
            </div>
            {onPickup && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent modal from opening
                    onPickup(item.id);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Check className="w-4 h-4" />
                  <span>Mark as Picked Up</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedItem && (
        <StockItemModal
          isOpen={true}
          onClose={() => setSelectedItem(null)}
          item={selectedItem}
          onPickup={onPickup}
        />
      )}
    </>
  );
};

export default StockList;