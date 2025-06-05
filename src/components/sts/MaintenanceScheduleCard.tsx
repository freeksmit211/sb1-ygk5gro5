import React, { useState } from 'react';
import { AlertTriangle, Car, Settings, Plus, Clock, Download, CheckCircle } from 'lucide-react';
import { addVehicleService } from '../../services/vehicleService';
import { VehicleService } from '../../types/vehicle';
import { FuelEntry } from '../../types/fuel';
import VehicleServiceModal from './VehicleServiceModal';

interface MaintenanceScheduleCardProps {
  title: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  description: string;
  tasks: string[];
  type: 'light' | 'aircon' | 'earth' | 'ppe';
}

const MaintenanceScheduleCard: React.FC<MaintenanceScheduleCardProps> = ({
  title,
  icon: Icon,
  color,
  bgColor,
  description,
  tasks,
  type
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    notes: '',
    tasksCompleted: [] as string[]
  });
  const [submitting, setSubmitting] = useState(false);

  const toggleTask = (task: string) => {
    setFormData(prev => ({
      ...prev,
      tasksCompleted: prev.tasksCompleted.includes(task)
        ? prev.tasksCompleted.filter(t => t !== task)
        : [...prev.tasksCompleted, task]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    try {
      setSubmitting(true);
      // TODO: Implement submission logic
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error submitting maintenance:', error);
      setError('Failed to submit maintenance record');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Schedule Header */}
      <div className={`p-6 rounded-lg ${bgColor}`}>
        <div className="flex items-center gap-4 mb-4">
          <div className={`p-3 rounded-full bg-white ${color}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>

        {/* Task List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tasks.map((task, index) => (
            <div key={index} className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 mt-0.5 text-gray-400" />
              <span className="text-sm text-gray-700">{task}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Add Entry Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full flex items-center justify-center gap-2 p-4 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors border border-blue-200"
      >
        <Plus className="w-5 h-5" />
        <span>Add Completion Entry</span>
      </button>

      {/* Add Entry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Completion Entry</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Completion Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Completed Tasks</label>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  {tasks.map((task, index) => (
                    <label key={index} className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={formData.tasksCompleted.includes(task)}
                          onChange={() => toggleTask(task)}
                          className="sr-only peer"
                        />
                        <div className="w-6 h-6 border-2 rounded-full border-gray-300 peer-checked:border-green-500 peer-checked:bg-green-500 transition-colors">
                          {formData.tasksCompleted.includes(task) && (
                            <CheckCircle className="w-full h-full text-white p-0.5" />
                          )}
                        </div>
                      </div>
                      <span className="text-gray-700 group-hover:text-gray-900">{task}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                  rows={4}
                  required
                  placeholder="Enter completion details and any observations..."
                />
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    'Save Entry'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaintenanceScheduleCard;