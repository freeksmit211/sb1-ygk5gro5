import React, { useState, useRef } from 'react';
import { Camera, X, Upload, Download } from 'lucide-react';
import { addVehicleIncident, uploadIncidentPhoto } from '../../services/vehicleIncidentService';
import VehicleSelect from '../fuel/VehicleSelect';
import DriverSelect from '../fuel/DriverSelect';
import { generateVehicleIncidentPDF } from '../../utils/pdfGenerator';
import { VehicleIncident } from '../../types/vehicleIncident';

const VehicleIncidentForm: React.FC = () => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    vehicle: '',
    driver: '',
    location: '',
    description: '',
    damagePhotos: [] as string[]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [previewPhotos, setPreviewPhotos] = useState<{ file: File; preview: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [submittedIncident, setSubmittedIncident] = useState<VehicleIncident | null>(null);

  // ... existing handlePhotoChange and other functions ...

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
          const url = await uploadIncidentPhoto(file, 'temp');
          return url;
        })
      );

      // Submit incident with photo URLs
      const incident: VehicleIncident = {
        id: crypto.randomUUID(),
        date: formData.date,
        vehicle: formData.vehicle,
        driver: formData.driver,
        location: formData.location,
        description: formData.description,
        damagePhotos: photoUrls,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await addVehicleIncident(incident);
      setSubmittedIncident(incident);

      // Reset form
      setFormData({
        date: new Date().toISOString().split('T')[0],
        vehicle: '',
        driver: '',
        location: '',
        description: '',
        damagePhotos: []
      });
      
      // Clear previews
      previewPhotos.forEach(photo => URL.revokeObjectURL(photo.preview));
      setPreviewPhotos([]);

      setSuccess(true);
    } catch (error) {
      console.error('Failed to submit incident:', error);
      alert('Failed to submit incident. Please try again.');
    } finally {
      setIsSubmitting(false);
      setUploadingPhotos(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Vehicle Incident Report</h2>

      {success && submittedIncident && (
        <div className="mb-6 flex items-center justify-between p-4 bg-green-50 text-green-700 rounded-lg">
          <span>Incident report submitted successfully!</span>
          <button
            onClick={() => generateVehicleIncidentPDF(submittedIncident)}
            className="flex items-center gap-2 text-green-700 hover:text-green-800"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Date
          </label>
          <input
            type="date"
            id="date"
            value={formData.date}
            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="vehicle" className="block text-sm font-medium text-gray-700">
            Vehicle
          </label>
          <VehicleSelect
            id="vehicle"
            value={formData.vehicle}
            onChange={(value) => setFormData(prev => ({ ...prev, vehicle: value }))}
            required
          />
        </div>

        <div>
          <label htmlFor="driver" className="block text-sm font-medium text-gray-700">
            Driver
          </label>
          <DriverSelect
            id="driver"
            value={formData.driver}
            onChange={(value) => setFormData(prev => ({ ...prev, driver: value }))}
            required
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            type="text"
            id="location"
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

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
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-24 h-24 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400"
            >
              <Camera className="w-6 h-6 text-gray-400" />
              <span className="text-sm text-gray-500">Add Photo</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                const newPreviews = files.map(file => ({
                  file,
                  preview: URL.createObjectURL(file)
                }));
                setPreviewPhotos(prev => [...prev, ...newPreviews]);
                e.target.value = '';
              }}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || uploadingPhotos}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VehicleIncidentForm;