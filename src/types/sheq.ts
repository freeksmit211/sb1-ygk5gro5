export interface CompanyDocument {
  id: string;
  fileUrl: string;
  fileName: string;
  type: 'safetyFile' | 'medicals' | 'inductions';
  expiryDate: string;
  uploadedAt: string;
}

export interface PersonnelDocument {
  id: string;
  fileUrl: string;
  fileName: string;
  type: 'medicals' | 'inductions' | 'first_aid_training' | 'firefighting_training' | 'legal_liability' | 'safety_documents';
  expiryDate: string;
  uploadedAt: string;
}

export interface Personnel {
  id: string;
  name: string;
  idNumber: string;
  position: string;
  contactNumber: string;
  documents: PersonnelDocument[];
  createdAt: string;
}

export interface Vehicle {
  id: string;
  registration: string;
  make: string;
  model: string;
  year: number;
  permit?: {
    id: string;
    fileUrl: string;
    fileName: string;
    expiryDate: string;
    uploadedAt: string;
  };
  createdAt: string;
}

export interface Company {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  documents: CompanyDocument[];
  personnel: Personnel[];
  vehicles: Vehicle[];
  createdAt: string;
}