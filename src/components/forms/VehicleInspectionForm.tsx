import React, { useState, useEffect, useRef } from 'react';
import { Camera, X, Upload, Download, CheckCircle2, Eye } from 'lucide-react';
import { addVehicleInspection, getVehicleInspections } from '../../services/vehicleInspectionService';
import VehicleSelect from '../fuel/VehicleSelect';
import DriverSelect from '../fuel/DriverSelect';
import { generateVehicleInspectionPDF } from '../../utils/pdfGenerator';
import { VehicleInspection } from '../../types/vehicleInspection';
import { Link } from 'react-router-dom';

const INSPECTION_ITEMS: { label: string; key: keyof VehicleInspection['items']; category: string; }[] = [
  // Body & Exterior
  { label: 'Body Panels (Dents & Scratches)', key: 'bodyPanels', category: 'Body & Exterior' },
  { label: 'Windscreen & Wipers', key: 'windscreenWipers', category: 'Body & Exterior' },
  { label: 'Number Plates, License Disk & Permits', key: 'numberPlatesAndPermits', category: 'Body & Exterior' },
  { label: 'Tires (Condition & Pressure)', key: 'tires', category: 'Body & Exterior' },
  { label: 'Spare Wheel (Condition & Pressure)', key: 'spareWheel', category: 'Body & Exterior' },
  { label: 'Tonneau Cover / Canopy', key: 'tonneauCover', category: 'Body & Exterior' },
  { label: 'Exterior Condition & Cleanliness', key: 'exteriorCondition', category: 'Body & Exterior' },
  
  // Engine & Mechanical
  { label: 'Fluid Levels (Oil, Coolant, Brake)', key: 'fluidLevels', category: 'Engine & Mechanical' },
  { label: 'Battery & Terminals', key: 'batteryAndTerminals', category: 'Engine & Mechanical' },
  { label: 'Engine Belts & Covers', key: 'engineBelts', category: 'Engine & Mechanical' },
  { label: 'Engine Compartment Condition & Cleanliness', key: 'engineCompartment', category: 'Engine & Mechanical' },
  
  // Lights & Electrical
  { label: 'Lights (DRL, Head, Tail, Brake, Turn Signals, Hazards)', key: 'lights', category: 'Lights & Electrical' },
  { label: 'Brakes (Including Handbrake)', key: 'brakes', category: 'Lights & Electrical' },
  { label: 'Horn & Reverse Hooter', key: 'hornAndHooter', category: 'Lights & Electrical' },
  { label: 'Mirrors (Exterior & Rear View)', key: 'mirrors', category: 'Lights & Electrical' },
  
  // Interior
  { label: 'Seat Belts', key: 'seatBelts', category: 'Interior' },
  { label: 'Logbook & Pen', key: 'logbook', category: 'Interior' },
  { label: 'Condition of Accessories, Buttons, etc.', key: 'accessories', category: 'Interior' },
  { label: 'Upholstery / Seat Covers & Roof Liner', key: 'upholstery', category: 'Interior' },
  { label: 'Interior Condition & Cleanliness', key: 'interiorCondition', category: 'Interior' },
  
  // Safety Equipment
  { label: 'Tools (Triangle, Jack, Wheel Spanner, Key, Locknut)', key: 'tools', category: 'Safety Equipment' },
  { label: 'First Aid Kit', key: 'firstAidKit', category: 'Safety Equipment' },
  { label: 'Fire Extinguisher', key: 'fireExtinguisher', category: 'Safety Equipment' },
  { label: 'Buggy Whip & Reflector Strips', key: 'buggyWhip', category: 'Safety Equipment' },
  { label: 'Stop Blocks', key: 'stopBlocks', category: 'Safety Equipment' },
  { label: 'Magnetic Amber Strobe Light', key: 'strobeLight', category: 'Safety Equipment' }
];

const VehicleInspectionForm: React.FC = () => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    vehicle: '',
    driver: '',
    mileage: '',
    items: Object.fromEntries(
      INSPECTION_ITEMS.map(item => [item.key, false])
    ) as VehicleInspection['items'],
    notes: '',
    damagePhotos: [] as string[]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [previewPhotos, setPreviewPhotos] = useState<{ file: File; preview: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [inspections, setInspections] = useState<VehicleInspection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInspections();
  }, []);

  useEffect(() => {
    // Cleanup previews when component unmounts
    return () => {
      previewPhotos.forEach(photo => URL.revokeObjectURL(photo.preview));
    };
  }, [previewPhotos]);

  const loadInspections = async () => {
    try {
      setLoading(true);
      const data = await getVehicleInspections();
      setInspections(data);
    } catch (error) {
      console.error('Failed to load inspections:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      setSuccess(false);
      setUploadingPhotos(true);

      // Upload photos first
      const photoUrls = await Promise.all(
        previewPhotos.map(async ({ file }) => {
          // In a real app, you would upload the file to your server/storage here
          // For now, we'll just use the object URL
          return URL.createObjectURL(file);
        })
      );

      // Submit inspection with photo URLs
      await addVehicleInspection({
        ...formData,
        mileage: Number(formData.mileage),
        damagePhotos: photoUrls
      });

      // Reset form
      setFormData({
        date: new Date().toISOString().split('T')[0],
        vehicle: '',
        driver: '',
        mileage: '',
        items: Object.fromEntries(
          INSPECTION_ITEMS.map(item => [item.key, false])
        ) as VehicleInspection['items'],
        notes: '',
        damagePhotos: []
      });
      
      // Clear previews
      previewPhotos.forEach(photo => URL.revokeObjectURL(photo.preview));
      setPreviewPhotos([]);

      setSuccess(true);
      await loadInspections();
    } catch (error) {
      console.error('Failed to submit inspection:', error);
      alert('Failed to submit inspection. Please try again.');
    } finally {
      setIsSubmitting(false);
      setUploadingPhotos(false);
    }
  };

  const toggleItem = (key: keyof VehicleInspection['items']) => {
    setFormData(prev => ({
      ...prev,
      items: {
        ...prev.items,
        [key]: !prev.items[key]
      }
    }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newPreviews = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setPreviewPhotos(prev => [...prev, ...newPreviews]);
    e.target.value = '';
  };

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setPreviewPhotos(prev => [...prev, { file, preview }]);
    }
    e.target.value = '';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Get only the last 5 inspections for the summary
  const recentInspections = inspections.slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Vehicle Monthly Inspection Form</h2>

        {success && (
          <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg">
            Inspection submitted successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Mileage</label>
              <input
                type="number"
                value={formData.mileage}
                onChange={(e) => setFormData(prev => ({ ...prev, mileage: e.target.value }))}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                required
                min="0"
              />
            </div>

            <VehicleSelect
              value={formData.vehicle}
              onChange={(value) => setFormData(prev => ({ ...prev, vehicle: value }))}
            />

            <DriverSelect
              value={formData.driver}
              onChange={(value) => setFormData(prev => ({ ...prev, driver: value }))}
            />
          </div>

          {/* Inspection Items */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Inspection Items</h3>
            <div className="space-y-6">
              {Object.entries(
                INSPECTION_ITEMS.reduce((acc, item) => {
                  if (!acc[item.category]) {
                    acc[item.category] = [];
                  }
                  acc[item.category].push(item);
                  return acc;
                }, {} as Record<string, typeof INSPECTION_ITEMS>)
              ).map(([category, items]) => (
                <div key={category} className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-4">{category}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {items.map(item => (
                      <label key={item.key} className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={formData.items[item.key]}
                            onChange={() => toggleItem(item.key)}
                            className="sr-only peer"
                          />
                          <div className="w-6 h-6 border-2 rounded-full border-gray-300 peer-checked:border-green-500 peer-checked:bg-green-500 transition-colors">
                            {formData.items[item.key] && (
                              <CheckCircle2 className="w-full h-full text-white p-0.5" />
                            )}
                          </div>
                        </div>
                        <span className="text-gray-700 group-hover:text-gray-900">{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Photo Capture Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Damage Photos
            </label>
            <div className="flex flex-wrap gap-4">
              {previewPhotos.map((photo, index) => (
                <div key={index} className="relative">
                  <img
                    src={photo.preview}
                    alt={`Damage preview ${index + 1}`}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      URL.revokeObjectURL(photo.preview);
                      setPreviewPhotos(prev => prev.filter((_, i) => i !== index));
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              {/* Camera capture button */}
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="w-24 h-24 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 bg-gray-50"
              >
                <Camera className="w-6 h-6 text-gray-400" />
                <span className="text-sm text-gray-500">Take Photo</span>
              </button>

              {/* File upload button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-24 h-24 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400"
              >
                <Upload className="w-6 h-6 text-gray-400" />
                <span className="text-sm text-gray-500">Upload</span>
              </button>

              {/* Hidden file inputs */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileSelect}
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleCameraCapture}
              />
            </div>
          </div>

          {/* Notes Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
              rows={4}
              placeholder="Enter any additional notes or observations"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || uploadingPhotos}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Inspection'}
            </button>
          </div>
        </form>
      </div>

      {/* Recent Inspections Summary */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Recent Inspections</h2>
          <Link
            to="/vehicles/inspections/history"
            className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>View All</span>
          </Link>
        </div>
        
        <div className="space-y-4">
          {recentInspections.map(inspection => (
            <div key={inspection.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900">{inspection.vehicle}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(inspection.date).toLocaleDateString()} - {inspection.driver}
                  </p>
                </div>
                <button
                  onClick={() => generateVehicleInspectionPDF(inspection)}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </button>
              </div>
              <div className="text-sm text-gray-600">
                <p>Mileage: {inspection.mileage.toLocaleString()} km</p>
                {inspection.notes && (
                  <p className="mt-2 text-gray-700">{inspection.notes}</p>
                )}
              </div>
            </div>
          ))}
          
          {recentInspections.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No inspections found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleInspectionForm;