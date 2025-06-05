import React, { useState } from 'react';
import { X } from 'lucide-react';
import { addJob } from '../../services/jobService';
import { NewJob } from '../../types/job';

interface JobModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date;
  onJobAdded: () => void;
}

const JobModal: React.FC<JobModalProps> = ({
  isOpen,
  onClose,
  date,
  onJobAdded
}) => {
  const [formData, setFormData] = useState<NewJob>({
    title: '',
    description: '',
    jobDate: date.toISOString().split('T')[0],
    status: 'planned',
    priority: 'medium',
    assignedTo: [],
    client: '',
    notes: '',
    jobCardNumber: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addJob(formData);
      onJobAdded();
      onClose();
    } catch (error) {
      console.error('Failed to add job:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center overflow-y-auto py-4 z-50">
      <div className="relative bg-white rounded-lg w-full max-w-md my-auto">
        <div className="sticky top-0 px-6 py-4 bg-blue-600 flex justify-between items-center rounded-t-lg z-10">
          <h3 className="text-xl font-bold text-white">Add Job</h3>
          <button onClick={onClose} className="text-white hover:text-blue-100">
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Job Card Number</label>
            <input
              type="text"
              value={formData.jobCardNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, jobCardNumber: e.target.value }))}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
              placeholder="Enter job card number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Job Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
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
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Job Date</label>
            <input
              type="date"
              value={formData.jobDate}
              onChange={(e) => setFormData(prev => ({ ...prev, jobDate: e.target.value }))}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                required
              >
                <option value="planned">Planned</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="on-hold">On Hold</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                required
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Client</label>
            <input
              type="text"
              value={formData.client}
              onChange={(e) => setFormData(prev => ({ ...prev, client: e.target.value }))}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Add Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobModal;