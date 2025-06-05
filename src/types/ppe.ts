export interface EmployeePPESizes {
  id: string;
  name: string;
  shoeSize: string;
  pantsSize: string;
  hardHatSize: string;
  reflectorVestSize: string;
  gloveSize: string;
  jacketSize: string;
  createdAt: string;
  updatedAt: string;
}

export interface PPEOrder {
  id: string;
  employeeId: string;
  items: {
    type: 'shoes' | 'pants' | 'hardHat' | 'reflectorVest' | 'gloves' | 'jacket';
    size: string;
    quantity: number;
  }[];
  status: 'pending' | 'approved' | 'completed';
  notes?: string;
  createdAt: string;
}

export type NewPPEOrder = Omit<PPEOrder, 'id' | 'createdAt'>;