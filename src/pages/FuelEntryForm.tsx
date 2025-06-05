import React from 'react';
import { ArrowLeft, Car, FileText, FileCheck, Fuel, FileSpreadsheet } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import FuelForm from '../components/fuel/FuelForm';

const FuelEntryForm: React.FC = () => {
  const navigate = useNavigate();

  const vehicleSections = [
    { 
      id: 'register',
      title: 'Vehicle Register', 
      icon: Car, 
      description: 'View and manage all company vehicles',
      href: '/vehicles',
      active: false
    },
    { 
      id: 'inspections',
      title: 'Vehicle Inspections', 
      icon: FileCheck, 
      description: 'Complete and view inspection reports',
      href: '/vehicles/inspections',
      active: false
    },
    { 
      id: 'service',
      title: 'Service Status', 
      icon: FileText, 
      description: 'Monitor vehicle service schedules',
      href: '/vehicles/service',
      active: false
    },
    {
      id: 'license',
      title: 'License Status',
      icon: FileSpreadsheet,
      description: 'Track vehicle license renewals',
      href: '/vehicles/license',
      active: false
    },
    {
      id: 'fuel',
      title: 'Fuel Form',
      icon: Fuel,
      description: 'Record vehicle fuel consumption',
      href: '/forms/fuel',
      active: true
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Vehicle Management Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {vehicleSections.map((section) => (
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
        <div className="flex items-center gap-3 mb-6">
          <Fuel className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">Fuel Entry Form</h2>
        </div>
        <FuelForm />
      </div>
    </div>
  );
};

export default FuelEntryForm;