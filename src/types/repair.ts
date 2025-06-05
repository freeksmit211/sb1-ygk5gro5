export type RepairStatus = 
  | 'new'
  | 'awaiting-po'
  | 'at-repair-centre'
  | 'repaired'
  | 'scrapped'
  | 'completed';

export interface Repair {
  id: string;
  date: string;
  customerName: string;
  jobNumber: string;
  serialNumber: string;
  status: RepairStatus;
  itemDescription: string;
  repairDescription: string;
  createdAt: string;
  updatedAt: string;
}

export type NewRepair = Omit<Repair, 'id' | 'date' | 'createdAt' | 'updatedAt'>;