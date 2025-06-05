import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Download, Calendar, User, Car } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { VehicleInspection } from '../types/vehicleInspection';
import { getVehicleInspections } from '../services/vehicleInspectionService';
import { generateVehicleInspectionPDF } from '../utils/pdfGenerator';

const VehicleInspectionHistory: React.FC = () => {
  const navigate = useNavigate();
  const [inspections, setInspections] = useState<VehicleInspection[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadInspections();
  }, []);

  const loadInspections = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getVehicleInspections();
      setInspections(data);
    } catch (error) {
      console.error('Failed to load inspections:', error);
      setError('Failed to load inspection history');
    } finally {
      setLoading(false);
    }
  };

  const filteredInspections = inspections.filter(inspection => {
    const searchLower = searchQuery.toLowerCase();
    return (
      inspection.vehicle.toLowerCase().includes(searchLower) ||
      inspection.driver.toLowerCase().includes(searchLower) ||
      inspection.notes?.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="p-6 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/vehicles/inspections')}
          className="text-white hover:text-blue-100"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-white">Vehicle Inspection History</h1>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        {error ? (
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={loadInspections}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by vehicle, driver, or notes..."
                  className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="space-y-4">
              {filteredInspections.map(inspection => (
                <div key={inspection.id} className="bg-gray-50 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Car className="w-5 h-5 text-blue-600" />
                        <h3 className="text-lg font-semibold text-gray-900">{inspection.vehicle}</h3>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(inspection.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <User className="w-4 h-4" />
                        <span>{inspection.driver}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => generateVehicleInspectionPDF(inspection)}
                      className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download PDF</span>
                    </button>
                  </div>

                  <div className="grid gap-6">
                    {/* Inspection Items */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Object.entries(inspection.items).map(([key, checked]) => (
                        <div key={key} className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full ${checked ? 'bg-green-500' : 'bg-red-500'}`} />
                          <span className="text-sm text-gray-700">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Damage Photos */}
                    {inspection.damagePhotos && inspection.damagePhotos.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Damage Photos</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {inspection.damagePhotos.map((photo, index) => (
                            <a
                              key={index}
                              href={photo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block aspect-square rounded-lg overflow-hidden hover:opacity-90 transition-opacity"
                            >
                              <img
                                src={photo}
                                alt={`Damage photo ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Notes */}
                    {inspection.notes && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
                        <p className="text-gray-700 whitespace-pre-wrap">{inspection.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {filteredInspections.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  {searchQuery ? 'No matching inspections found' : 'No inspections found'}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VehicleInspectionHistory;