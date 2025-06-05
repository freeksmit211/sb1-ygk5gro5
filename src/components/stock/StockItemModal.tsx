import React from 'react';
import { X, Package, Building2, User, Clock } from 'lucide-react';
import { StockItem } from '../../types/stock';

interface StockItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: StockItem;
  onPickup?: (itemId: string) => Promise<void>;
}

const StockItemModal: React.FC<StockItemModalProps> = ({
  isOpen,
  onClose,
  item,
  onPickup
}) => {
  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="px-6 py-4 bg-blue-600 flex justify-between items-center rounded-t-lg">
          <h3 className="text-xl font-bold text-white">Stock Item Details</h3>
          <button onClick={onClose} className="text-white hover:text-blue-100">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{item.itemName}</h4>
                  <span className="inline-block mt-1 px-2 py-1 text-sm rounded-full bg-green-100 text-green-800">
                    {item.quantity} units
                  </span>
                </div>
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Client Name</label>
                <div className="flex items-center gap-2 mt-1">
                  <User className="w-4 h-4 text-gray-400" />
                  <p className="text-gray-900">{item.clientName}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Company</label>
                <div className="flex items-center gap-2 mt-1">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  <p className="text-gray-900">{item.clientCompany}</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500">Assigned To</label>
              <p className="mt-1 text-gray-900">{item.assignedTo}</p>
            </div>

            {item.notes && (
              <div>
                <label className="block text-sm font-medium text-gray-500">Notes</label>
                <p className="mt-1 text-gray-900 whitespace-pre-wrap">{item.notes}</p>
              </div>
            )}

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>Submitted: {formatDate(item.submittedAt)}</span>
            </div>

            {onPickup && (
              <div className="pt-4 border-t">
                <button
                  onClick={() => onPickup(item.id)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Mark as Picked Up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockItemModal;