import React, { useState, useEffect } from 'react';
import { getStockItems } from '../../services/stockService';
import { StockItem } from '../../types/stock';
import RepStockList from './RepStockList';

interface RepPerformanceStockProps {
  repId: string;
  repName: string;
}

const RepPerformanceStock: React.FC<RepPerformanceStockProps> = ({ repId, repName }) => {
  const [items, setItems] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStockItems = async () => {
      try {
        setLoading(true);
        const allItems = await getStockItems();
        const repItems = allItems.filter(item => item.assignedTo === repId);
        setItems(repItems);
      } catch (error) {
        console.error('Failed to load stock items:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStockItems();
  }, [repId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">{repName}'s Stock Items</h2>
      <RepStockList items={items} />
    </div>
  );
};

export default RepPerformanceStock;