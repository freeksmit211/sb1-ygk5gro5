import React, { useState, useRef } from 'react';
import { Camera, Upload, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface IncidentFormProps {
  onSubmit: () => void;
}

const IncidentForm: React.FC<IncidentFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    location: '',
    description: '',
    severity: 'low' as 'low' | 'medium' | 'high',
    photos: [] as string[]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [previewPhotos, setPreviewPhotos] = useState<{ file: File; preview: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      setUploadingPhotos(true);

      // Upload photos first
      const photoUrls = await Promise.all(
        previewPhotos.map(async ({ file }) => {
          const filePath = `sheq/incidents/${Date.now()}_${file.name}`;
          const { error: uploadError } = await supabase.storage
            .from('documents')
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('documents')
            .getPublicUrl(filePath);

          return publicUrl;
        })
      );

      // Submit incident with photo URLs
      const { error } = await supabase
        .from('sheq_incidents')
        .insert({
          date: formData.date,
          location: formData.location,
          description: formData.description,
          severity: formData.severity,
          photos: photoUrls,
          status: 'open'
        });

      if (error) throw error;

      // Reset form
      setFormData({
        date: new Date().toISOString().split('T')[0],
        location: '',
        description: '',
        severity: 'low',
        photos: []
      });
      
      // Clear previews
      previewPhotos.forEach(photo => URL.revokeObjectURL(photo.preview));
      setPreviewPhotos([]);

      onSubmit();
    } catch (error) {
      console.error('Failed to submit incident:', error);
      alert('Failed to submit incident. Please try again.');
    } finally {
      setIsSubmitting(false);
      setUploadingPhotos(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Report SHEQ Incident</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
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
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
            rows={4}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Severity</label>
          <select
            value={formData.severity}
            onChange={(e) => setFormData(prev => ({ ...prev, severity: e.target.value as 'low' | 'medium' | 'high' }))}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
            required
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Photos
          </label>
          <div className="flex flex-wrap gap-4">
            {previewPhotos.map((photo, index) => (
              <div key={index} className="relative">
                <img
                  src={photo.preview}
                  alt={`Preview ${index + 1}`}
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
              onChange={handleFileChange}
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

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || uploadingPhotos}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default IncidentForm;