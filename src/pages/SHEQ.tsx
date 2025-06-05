import React, { useState, useEffect } from 'react';
import { ShieldCheck, AlertTriangle, FileText, Plus, Building2, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import AddCompanyModal from '../components/sheq/AddCompanyModal';
import CompanyList from '../components/sheq/CompanyList';
import { getCompanies } from '../services/sheqService';
import { Company } from '../types/sheq';

const SHEQ: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sheqSections = [
    {
      id: 'safety-files',
      title: 'Safety Files',
      icon: ShieldCheck,
      description: 'Manage company safety files and documentation',
      href: '/sheq',
      active: true
    },
    {
      id: 'incidents',
      title: 'Incidents',
      icon: AlertTriangle,
      description: 'Report and track safety incidents',
      href: '/sheq/incidents',
      active: false
    },
    {
      id: 'contractor-packs',
      title: 'Contractor Packs',
      icon: FileText,
      description: 'Manage contractor safety documentation',
      href: '/sheq/contractor-packs',
      active: false
    },
    {
      id: 'ppe-register',
      title: 'PPE Register',
      icon: Shield,
      description: 'Manage personal protective equipment',
      href: '/ppe/register',
      active: false
    }
  ];

  const loadCompanies = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCompanies();
      setCompanies(data);
    } catch (error: any) {
      console.error('Failed to load companies:', error);
      setError('Failed to load companies. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  if (loading) {
    return (
      <div className="p-6 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* SHEQ Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {sheqSections.map((section) => (
          <Link 
            key={section.id}
            to={section.href}
            className={`flex items-center gap-3 p-4 rounded-lg transition-all h-full ${
              section.active 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'bg-white text-gray-900 hover:bg-gray-50'
            }`}
          >
            <section.icon className={`w-5 h-5 ${section.active ? 'text-white' : 'text-blue-600'}`} />
            <div>
              <span className="font-medium">{section.title}</span>
              <p className="text-sm opacity-75 mt-1">{section.description}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Safety Files</h2>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            Add Company
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <CompanyList companies={companies} />
      </div>

      <AddCompanyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCompanyAdded={() => {
          loadCompanies();
          setIsModalOpen(false);
        }}
      />
    </div>
  );
};

export default SHEQ;