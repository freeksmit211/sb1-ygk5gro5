import React from 'react';
import { ArrowLeft, FileText, Plus, Building2, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import CompanyList from '../components/sheq/CompanyList';

const ContractorPacks: React.FC = () => {
  const sheqSections = [
    {
      id: 'safety-files',
      title: 'Safety Files',
      icon: Building2,
      description: 'Manage company safety files and documentation',
      href: '/sheq',
      active: false
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
      active: true
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* SHEQ Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sheqSections.map((section) => (
          <Link 
            key={section.id}
            to={section.href}
            className={`flex items-center gap-3 p-4 rounded-lg transition-all ${
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
            <FileText className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Contractor Safety Files</h2>
          </div>
          <button
            onClick={() => {/* TODO: Add contractor pack */}}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            Add Contractor
          </button>
        </div>

        <CompanyList companies={[]} />
      </div>
    </div>
  );
};

export default ContractorPacks;