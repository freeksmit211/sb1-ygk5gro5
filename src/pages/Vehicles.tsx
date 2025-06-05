import React from 'react';
import { Car, FileText, FileCheck, Fuel, FileSpreadsheet } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import VehicleInspectionForm from '../components/forms/VehicleInspectionForm';
import VehicleRegister from '../components/vehicles/VehicleRegister';
import VehicleLicenseSection from '../components/dashboard/VehicleLicenseSection';
import VehicleInspectionDashboard from '../components/dashboard/VehicleInspectionDashboard';

const Vehicles: React.FC = () => {
  const location = useLocation();

  const vehicleSections = [
    { 
      id: 'register',
      title: 'Vehicle Register', 
      icon: Car, 
      description: 'View and manage all company vehicles',
      href: '/vehicles',
      active: location.pathname === '/vehicles'
    },
    { 
      id: 'inspections',
      title: 'Vehicle Inspections', 
      icon: FileCheck, 
      description: 'Complete and view inspection reports',
      href: '/vehicles/inspections',
      active: location.pathname === '/vehicles/inspections'
    },
    { 
      id: 'service',
      title: 'Service Status', 
      icon: FileText, 
      description: 'Monitor vehicle service schedules',
      href: '/vehicles/service',
      active: location.pathname === '/vehicles/service'
    },
    {
      id: 'license',
      title: 'License Status',
      icon: FileSpreadsheet,
      description: 'Track vehicle license renewals',
      href: '/vehicles/license',
      active: location.pathname === '/vehicles/license'
    },
    {
      id: 'fuel',
      title: 'Fuel Form',
      icon: Fuel,
      description: 'Record vehicle fuel consumption',
      href: '/forms/fuel',
      active: location.pathname === '/forms/fuel'
    }
  ];

  const renderActiveSection = () => {
    switch (location.pathname) {
      case '/vehicles':
        return (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <Car className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Vehicle Register</h2>
            </div>
            <VehicleRegister />
          </div>
        );
      case '/vehicles/inspections':
        return (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <FileCheck className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Vehicle Inspections</h2>
            </div>
            <VehicleInspectionForm />
          </div>
        );
      case '/vehicles/service':
        return (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Service Status</h2>
            </div>
            <VehicleInspectionDashboard />
          </div>
        );
      case '/vehicles/license':
        return (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <FileSpreadsheet className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">License Status</h2>
            </div>
            <VehicleLicenseSection />
          </div>
        );
      default:
        return null;
    }
  };

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
      {renderActiveSection()}
    </div>
  );
};

export default Vehicles;