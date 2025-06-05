import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, User, Car, Pencil } from 'lucide-react';
import { getCompanyById, addCompanyContact, updateCompanyContact } from '../services/sheqService';
import { Company } from '../types/sheq';
import PersonnelList from '../components/sheq/PersonnelList';
import AddPersonnelModal from '../components/sheq/AddPersonnelModal';
import AddVehicleModal from '../components/sheq/AddVehicleModal';
import EditCompanyModal from '../components/sheq/EditCompanyModal';
import SafetyFileSection from '../components/sheq/SafetyFileSection';
import CompanyContactsSection from '../components/sheq/CompanyContactsSection';
import VehicleList from '../components/sheq/VehicleList';

const CompanyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPersonnelModalOpen, setIsPersonnelModalOpen] = useState(false);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const loadCompany = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const data = await getCompanyById(id);
      if (!data) {
        setError('Company not found');
        return;
      }
      setCompany(data);
    } catch (error) {
      console.error('Failed to load company:', error);
      setError('Failed to load company details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompany();
  }, [id]);

  const handleAddContact = async (contact: any) => {
    if (!company?.id) return;
    try {
      await addCompanyContact(company.id, contact);
      await loadCompany();
    } catch (error) {
      console.error('Failed to add contact:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="p-4 md:p-6">
        <button
          onClick={() => navigate('/sheq')}
          className="flex items-center gap-2 text-white mb-6 hover:text-blue-100"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Companies
        </button>
        
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-900 font-medium mb-4">{error}</p>
          <button
            onClick={loadCompany}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <button
        onClick={() => navigate('/sheq')}
        className="flex items-center gap-2 text-white mb-6 hover:text-blue-100"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Companies
      </button>

      <div className="space-y-6">
        {/* Company Header */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Building2 className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>
            </div>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Pencil className="w-4 h-4" />
              <span>Edit Company</span>
            </button>
          </div>
        </div>

        {/* Rest of the components */}
        <CompanyContactsSection
          companyId={company.id}
          primaryContact={{
            name: company.contactPerson,
            phone: company.phone,
            email: company.email
          }}
          additionalContacts={company.additionalContacts}
          onAddContact={handleAddContact}
        />

        <SafetyFileSection
          companyId={company.id}
          document={company.documents.find(doc => doc.type === 'safetyFile')}
          onDocumentUpdated={loadCompany}
        />

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <User className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Site Personnel</h2>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsVehicleModalOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Vehicle
              </button>
              <button
                onClick={() => setIsPersonnelModalOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Personnel
              </button>
            </div>
          </div>
          <PersonnelList 
            personnel={company.personnel || []} 
            companyId={company.id}
            onDocumentUploaded={loadCompany}
          />
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <Car className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Company Vehicles</h2>
          </div>
          <VehicleList
            vehicles={company.vehicles || []}
            companyId={company.id}
            onDocumentUploaded={loadCompany}
          />
        </div>
      </div>

      <AddPersonnelModal
        isOpen={isPersonnelModalOpen}
        onClose={() => setIsPersonnelModalOpen(false)}
        companyId={company.id}
        onPersonnelAdded={() => {
          loadCompany();
          setIsPersonnelModalOpen(false);
        }}
      />

      <AddVehicleModal
        isOpen={isVehicleModalOpen}
        onClose={() => setIsVehicleModalOpen(false)}
        companyId={company.id}
        onVehicleAdded={() => {
          loadCompany();
          setIsVehicleModalOpen(false);
        }}
      />

      <EditCompanyModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        company={company}
        onCompanyUpdated={loadCompany}
      />
    </div>
  );
};

export default CompanyDetails;