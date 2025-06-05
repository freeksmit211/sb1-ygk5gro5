import React, { useState, useEffect } from 'react';
import { Truck, Calendar, Package, FileText, Plus, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import StockList from '../components/stock/StockList';
import AddStockModal from '../components/stock/AddStockModal';
import { getStockItems, pickupStockItem } from '../services/stockService';
import { StockItem } from '../types/stock';

const Stock: React.FC = () => {
  const [items, setItems] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const adminButtons = [
    { 
      title: 'Deliveries', 
      icon: Truck, 
      href: '/deliveries',
      active: false
    },
    { 
      title: 'Meetings', 
      icon: Calendar, 
      href: '/meetings',
      active: false
    },
    { 
      title: 'Stock Ready', 
      icon: Package, 
      href: '/stock',
      active: true
    },
    { 
      title: 'Items to be Repaired', 
      icon: Wrench, 
      href: '/repairs',
      active: false
    },
    { 
      title: 'Outstanding Invoices', 
      icon: FileText, 
      href: '/invoices',
      active: false
    }
  ];

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true);
      const data = await getStockItems();
      setItems(data);
    } catch (error) {
      console.error('Failed to load stock items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePickup = async (itemId: string) => {
    if (!window.confirm('Are you sure you want to mark this item as picked up? This action cannot be undone.')) {
      return;
    }

    try {
      await pickupStockItem(itemId);
      await loadItems(); // Refresh the list
    } catch (error) {
      console.error('Failed to mark item as picked up:', error);
      alert('Failed to mark item as picked up. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      {/* Admin Navigation Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {adminButtons.map((button) => (
          <Link 
            key={button.title}
            to={button.href}
            className={`flex items-center gap-3 p-4 rounded-lg transition-all ${
              button.active 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'bg-white text-gray-900 hover:bg-gray-50'
            }`}
          >
            <button.icon className={`w-5 h-5 ${button.active ? 'text-white' : 'text-blue-600'}`} />
            <span className="font-medium">{button.title}</span>
          </Link>
        ))}
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Stock Items</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            Add Stock Item
          </button>
        </div>
        <StockList items={items} onPickup={handlePickup} />
      </div>

      <AddStockModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStockAdded={loadItems}
      />
    </div>
  );
};

export default Stock;