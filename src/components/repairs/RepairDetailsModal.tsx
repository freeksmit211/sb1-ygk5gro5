import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Repair } from '../../types/repair';

interface RepairDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  repair: Repair;
  onUpdate: (id: string, updates: Partial<Repair>) => Promise<void>;
}

const RepairDetailsModal: React.FC<RepairDetailsModalProps> = ({
  isOpen,
  onClose,
  repair,
  onUpdate
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(repair.status);
  const [repairDescription, setRepairDescription] = useState(repair.repairDescription);
  const [showCompleteConfirm, setShowCompleteConfirm] = useState(false);

  if (!isOpen) return null;

  const handleStatusChange = async (newStatus: string) => {
    try {
      setIsSubmitting(true);
      await onUpdate(repair.id, { 
        status: newStatus as Repair['status'],
        repairDescription
      });
      setStatus(newStatus as Repair['status']);
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleComplete = async () => {
    try {
      setIsSubmitting(true);
      await onUpdate(repair.id, { 
        status: 'completed',
        repairDescription 
      });
      onClose();
    } catch (error) {
      console.error('Failed to complete repair:', error);
    } finally {
      setIsSubmitting(false);
      setShowCompleteConfirm(false);
    }
  };

  const handleDescriptionUpdate = async () => {
    try {
      setIsSubmitting(true);
      await onUpdate(repair.id, { repairDescription });
    } catch (error) {
      console.error('Failed to update description:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: Repair['status']) => {
    switch (status) {
      case 'new':
        return 'bg-yellow-100 text-yellow-800';
      case 'awaiting-po':
        return 'bg-orange-100 text-orange-800';
      case 'at-repair-centre':
        return 'bg-blue-100 text-blue-800';
      case 'repaired':
        return 'bg-green-100 text-green-800';
      case 'scrapped':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: Repair['status']) => {
    switch (status) {
      case 'new':
        return 'New';
      case 'awaiting-po':
        return 'At Simotech - Awaiting PO';
      case 'at-repair-centre':
        return 'At Repair Centre';
      case 'repaired':
        return 'At Simotech - Repaired';
      case 'scrapped':
        return 'At Simotech - Scrapped';
      case 'completed':
        return 'Delivered/Completed';
      default:
        return status;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl">
        <div className="px-6 py-4 bg-blue-600 flex justify-between items-center rounded-t-lg">
          <h3 className="text-xl font-bold text-white">Repair Details</h3>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowCompleteConfirm(true)}
              className="px-4 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm font-medium"
              disabled={isSubmitting || status === 'completed'}
            >
              Complete
            </button>
            <button onClick={onClose} className="text-white hover:text-blue-100">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          {showCompleteConfirm && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-yellow-800 font-medium mb-4">
                Are you sure you want to mark this repair as completed? This will remove it from the active repairs list.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowCompleteConfirm(false)}
                  className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleComplete}
                  className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Completing...' : 'Yes, Complete'}
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500">Customer</label>
              <p className="mt-1 text-lg text-gray-900">{repair.customerName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Job Number</label>
              <p className="mt-1 text-lg text-gray-900">{repair.jobNumber}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Serial Number</label>
              <p className="mt-1 text-lg text-gray-900">{repair.serialNumber}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Date</label>
              <p className="mt-1 text-lg text-gray-900">{formatDate(repair.date)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Item Description</label>
              <p className="mt-1 text-gray-900 whitespace-pre-wrap">{repair.itemDescription}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Status</label>
              <select
                value={status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                disabled={isSubmitting || status === 'completed'}
              >
                <option value="new">New</option>
                <option value="awaiting-po">At Simotech - Awaiting PO</option>
                <option value="at-repair-centre">At Repair Centre</option>
                <option value="repaired">At Simotech - Repaired</option>
                <option value="scrapped">At Simotech - Scrapped</option>
                <option value="completed">Delivered/Completed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">Repair Description</label>
            <div className="flex flex-col gap-2">
              <textarea
                value={repairDescription}
                onChange={(e) => setRepairDescription(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2"
                rows={4}
                placeholder="Enter repair description and updates..."
              />
              <button
                onClick={handleDescriptionUpdate}
                disabled={isSubmitting || repairDescription === repair.repairDescription}
                className="self-end px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Update Description'}
              </button>
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepairDetailsModal;