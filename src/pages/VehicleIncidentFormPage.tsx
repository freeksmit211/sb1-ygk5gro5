import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import VehicleIncidentForm from '../components/forms/VehicleIncidentForm';

const VehicleIncidentFormPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/vehicles')}
          className="text-white hover:text-blue-100"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-white">Vehicle Incident Report</h1>
      </div>
      
      <VehicleIncidentForm />
    </div>
  );
};

export default VehicleIncidentFormPage;