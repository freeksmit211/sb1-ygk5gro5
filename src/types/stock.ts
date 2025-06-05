export interface StockItem {
  id: string;
  itemName: string;
  quantity: number;
  clientName: string;
  clientCompany: string;
  assignedTo: 'franco' | 'freek' | 'jeckie';
  notes?: string;
  status: 'ready' | 'pending' | 'shipped';
  submittedAt: string;
}

export type NewStockItem = Omit<StockItem, 'id' | 'submittedAt' | 'status'>;