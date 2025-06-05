import { 
  addCompany, 
  getCompanies, 
  getCompanyById, 
  addCompanyContact,
  updateCompanyContact,
  deleteCompanyContact,
  updateCompany
} from './sheq/company';
import { addPersonnel } from './sheq/personnel';
import { updateCompanyDocument } from './sheq/documents';
import { uploadFile } from './sheq/upload';
import { addVehicle, updateVehicle, deleteVehicle, getVehiclesByCompany } from './sheq/vehicle';

export {
  addCompany,
  getCompanies,
  getCompanyById,
  addCompanyContact,
  updateCompanyContact,
  deleteCompanyContact,
  updateCompany,
  addPersonnel,
  updateCompanyDocument,
  uploadFile,
  addVehicle,
  updateVehicle,
  deleteVehicle,
  getVehiclesByCompany
};