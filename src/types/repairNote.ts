export interface RepairNote {
  id: string;
  repairId: string;
  note: string;
  createdAt: string;
}

export type NewRepairNote = Omit<RepairNote, 'id' | 'createdAt'>;