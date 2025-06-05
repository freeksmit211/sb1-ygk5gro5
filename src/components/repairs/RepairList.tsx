import React, { useState, useEffect } from 'react';
import { Plus, Search, AlertTriangle } from 'lucide-react';
import { getRepairs, updateRepair } from '../../services/repairService';
import { Repair } from '../../types/repair';
import NewRepairModal from './NewRepairModal';
import RepairDetailsModal from './RepairDetailsModal';

const RepairList: React.FC = () => {
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRepair, setSelectedRepair] = useState<Repair | null>(null);

  const loadRepairs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getRepairs();
      setRepairs(data);
    } catch (error) {
      console.error('Failed to load repairs:', error);
      setError('Failed to load repairs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRepairs();
  }, []);

  const handleUpdateRepair = async (id: string, updates: Partial<Repair>): Promise<void> => {
    try {
      await updateRepair(id, updates);
      await loadRepairs();
    } catch (error) {
      console.error('Failed to update repair:', error);
    }
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

  const filteredRepairs = repairs.filter(repair => {
    const searchLower = searchQuery.toLowerCase();
    return (
      repair.customerName.toLowerCase().includes(searchLower) ||
      repair.jobNumber.toLowerCase().includes(searchLower) ||
      repair.serialNumber.toLowerCase().includes(searchLower) ||
      repair.itemDescription.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Repairs</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          New Repair
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-lg">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search repairs..."
          className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Job Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Serial Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Comments
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRepairs.map((repair) => (
                <tr 
                  key={repair.id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedRepair(repair)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(repair.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {repair.customerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {repair.jobNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {repair.serialNumber}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {repair.itemDescription}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(repair.status)}`}>
                      {getStatusLabel(repair.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {repair.repairDescription}
                  </td>
                </tr>
              ))}
              {filteredRepairs.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No repairs found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <NewRepairModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRepairAdded={loadRepairs}
      />

      {selectedRepair && (
        <RepairDetailsModal
          isOpen={true}
          onClose={() => setSelectedRepair(null)}
          repair={selectedRepair}
          onUpdate={handleUpdateRepair}
        />
      )}
    </div>
  );
};

export default RepairList;