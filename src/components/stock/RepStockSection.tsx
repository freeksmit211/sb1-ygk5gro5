import React from 'react';
import { StockItem } from '../../types/stock';
import StockList from './StockList';

interface RepStockSectionProps {
  title: string;
  items: StockItem[];
}

const RepStockSection: React.FC<RepStockSectionProps> = ({ title, items }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">{title}'s Stock Items</h2>
      <StockList items={items} />
    </div>
  );
};

export default RepStockSection;