import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Plus, AlertTriangle, Pencil, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface SalesRepAllocation {
  id: string;
  code: string;
  name: string;
}

const SalesRepAllocation: React.FC = () => {
  const navigate = useNavigate();
  const [allocations, setAllocations] = useState<SalesRepAllocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newRepData, setNewRepData] = useState({
    code: '',
    name: ''
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAllocations();
  }, []);

  const loadAllocations = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('sales_rep_allocations')
        .select('*')
        .order('code', { ascending: true });

      if (error) throw error;
      setAllocations(data || []);
    } catch (error) {
      console.error('Error loading allocations:', error);
      setError('Failed to load sales rep allocations');
    } finally {
      setLoading(false);
    }
  };

  const validateRepCode = (code: string) => {
    return /^S0[0-9]+$/.test(code);
  };

  const handleAddNewRep = async () => {
    try {
      setSaving(true);
      setError(null);

      if (!newRepData.code || !newRepData.name) {
        setError('Please provide both code and name for the new sales rep');
        return;
      }

      if (!validateRepCode(newRepData.code)) {
        setError('Sales rep code must be in the format "S0" followed by a number (e.g., S07)');
        return;
      }

      // Check if code already exists
      const { data: existingData, error: checkError } = await supabase
        .from('sales_rep_allocations')
        .select('*')
        .eq('code', newRepData.code);

      if (checkError) throw checkError;

      if (existingData && existingData.length > 0) {
        setError('This sales rep code is already in use');
        return;
      }

      // Add to sales_rep_allocations
      const { error: allocationError } = await supabase
        .from('sales_rep_allocations')
        .insert({
          code: newRepData.code,
          name: newRepData.name
        });

      if (allocationError) throw allocationError;

      alert('New sales rep added successfully!');
      setIsAddingNew(false);
      setNewRepData({ code: '', name: '' });
      await loadAllocations();
    } catch (error: any) {
      console.error('Error adding new rep:', error);
      setError(error.message || 'Failed to add new sales rep');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateRep = async (id: string, name: string) => {
    try {
      setSaving(true);
      setError(null);

      if (!name.trim()) {
        setError('Name cannot be empty');
        return;
      }

      const { error: updateError } = await supabase
        .from('sales_rep_allocations')
        .update({ name: name.trim() })
        .eq('id', id);

      if (updateError) throw updateError;

      setEditingId(null);
      await loadAllocations();
    } catch (error: any) {
      console.error('Error updating rep:', error);
      setError(error.message || 'Failed to update sales rep');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRep = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this sales rep? This action cannot be undone.')) {
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const { error: deleteError } = await supabase
        .from('sales_rep_allocations')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      await loadAllocations();
    } catch (error: any) {
      console.error('Error deleting rep:', error);
      setError(error.message || 'Failed to delete sales rep');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-600 p-6 flex justify-center items-start pt-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-600 p-6">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/')}
          className="text-white hover:text-blue-100"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-white">Sales Rep Code Allocation</h1>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        {error && (
          <div className="mb-6 flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-lg">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="mb-6">
          <button
            onClick={() => setIsAddingNew(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            Add New Sales Rep
          </button>
        </div>

        {isAddingNew && (
          <div className="mb-6 bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-4">Add New Sales Rep</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sales Rep Code
                </label>
                <input
                  type="text"
                  value={newRepData.code}
                  onChange={(e) => setNewRepData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                  placeholder="e.g., S07"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Must be "S0" followed by a number (e.g., S07)
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sales Rep Name
                </label>
                <input
                  type="text"
                  value={newRepData.name}
                  onChange={(e) => setNewRepData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter sales rep name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setIsAddingNew(false);
                  setNewRepData({ code: '', name: '' });
                  setError(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNewRep}
                disabled={saving || !newRepData.code || !newRepData.name}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Adding...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Add Rep</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {allocations.map(allocation => (
            <div key={allocation.id} className="flex flex-col md:flex-row md:items-center gap-4 bg-gray-50 p-4 rounded-lg">
              <div className="w-full md:w-32">
                <span className="text-lg font-semibold text-gray-900">
                  {allocation.code}
                </span>
              </div>
              <div className="flex-1">
                {editingId === allocation.id ? (
                  <input
                    type="text"
                    value={allocation.name}
                    onChange={(e) => {
                      const newAllocations = allocations.map(a =>
                        a.id === allocation.id ? { ...a, name: e.target.value } : a
                      );
                      setAllocations(newAllocations);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter sales rep name"
                    autoFocus
                  />
                ) : (
                  <span className="text-gray-700">{allocation.name}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {editingId === allocation.id ? (
                  <>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1.5 text-gray-600 hover:text-gray-800"
                      disabled={saving}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleUpdateRep(allocation.id, allocation.name)}
                      disabled={saving}
                      className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      {saving ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        'Save'
                      )}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setEditingId(allocation.id)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteRep(allocation.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      title="Delete"
                      disabled={saving}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SalesRepAllocation;