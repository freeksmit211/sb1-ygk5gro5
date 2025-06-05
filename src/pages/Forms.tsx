import React from 'react';
import { ArrowLeft, Fuel, Car, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Forms: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/')}
          className="text-white hover:text-blue-100"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-white">Forms</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Fuel Entry Form Button */}
        <button
          onClick={() => navigate('/forms/fuel')}
          className="bg-white rounded-lg shadow-lg p-6 text-left hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Fuel className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Fuel Entry Form</h2>
              <p className="text-sm text-gray-500">Record vehicle fuel consumption</p>
            </div>
          </div>
        </button>

        {/* Vehicle Inspection Form Button */}
        <button
          onClick={() => navigate('/forms/vehicle-inspection')}
          className="bg-white rounded-lg shadow-lg p-6 text-left hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Car className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Vehicle Inspection Form</h2>
              <p className="text-sm text-gray-500">Complete vehicle inspection checklist</p>
            </div>
          </div>
        </button>

        {/* Vehicle Incident Report Button */}
        <button
          onClick={() => navigate('/forms/vehicle-incident')}
          className="bg-white rounded-lg shadow-lg p-6 text-left hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Vehicle Incident Report</h2>
              <p className="text-sm text-gray-500">Report vehicle damage or incidents</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Forms;