import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import VehicleInspectionForm from '../components/forms/VehicleInspectionForm';

const VehicleInspectionFormPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/forms')}
          className="text-white hover:text-blue-100"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-white">Vehicle Inspection Form</h1>
      </div>
      
      <VehicleInspectionForm />
    </div>
  );
};

export default VehicleInspectionFormPage;