import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface EditEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: {
    id: string;
    name: string;
    department: string;
    sizes: {
      shoeSize: string;
      pantsSize: string;
      hardHatSize: string;
      reflectorVestSize: string;
      gloveSize: string;
      jacketSize: string;
    };
  };
  onSubmit: (id: string, data: {
    name: string;
    department: string;
    sizes: {
      shoeSize: string;
      pantsSize: string;
      hardHatSize: string;
      reflectorVestSize: string;
      gloveSize: string;
      jacketSize: string;
    };
  }) => void;
}

const EditEmployeeModal: React.FC<EditEmployeeModalProps> = ({
  isOpen,
  onClose,
  employee,
  onSubmit
}) => {
  const [formData, setFormData] = useState({
    name: employee.name,
    department: employee.department,
    sizes: {
      shoeSize: employee.sizes.shoeSize,
      pantsSize: employee.sizes.pantsSize,
      hardHatSize: employee.sizes.hardHatSize,
      reflectorVestSize: employee.sizes.reflectorVestSize,
      gloveSize: employee.sizes.gloveSize,
      jacketSize: employee.sizes.jacketSize
    }
  });

  useEffect(() => {
    setFormData({
      name: employee.name,
      department: employee.department,
      sizes: {
        shoeSize: employee.sizes.shoeSize,
        pantsSize: employee.sizes.pantsSize,
        hardHatSize: employee.sizes.hardHatSize,
        reflectorVestSize: employee.sizes.reflectorVestSize,
        gloveSize: employee.sizes.gloveSize,
        jacketSize: employee.sizes.jacketSize
      }
    });
  }, [employee]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(employee.id, formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="px-6 py-4 bg-blue-600 flex justify-between items-center rounded-t-lg">
          <h3 className="text-xl font-bold text-white">Edit Employee</h3>
          <button onClick={onClose} className="text-white hover:text-blue-100">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Department</label>
            <input
              type="text"
              value={formData.department}
              onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium text-gray-900 mb-4">PPE Sizes</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Shoe Size</label>
                <input
                  type="text"
                  value={formData.sizes.shoeSize}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    sizes: { ...prev.sizes, shoeSize: e.target.value }
                  }))}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Pants Size</label>
                <input
                  type="text"
                  value={formData.sizes.pantsSize}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    sizes: { ...prev.sizes, pantsSize: e.target.value }
                  }))}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Hard Hat Size</label>
                <select
                  value={formData.sizes.hardHatSize}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    sizes: { ...prev.sizes, hardHatSize: e.target.value }
                  }))}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                  required
                >
                  <option value="">Select size</option>
                  <option value="S">Small</option>
                  <option value="M">Medium</option>
                  <option value="L">Large</option>
                  <option value="XL">Extra Large</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Reflector Vest Size</label>
                <select
                  value={formData.sizes.reflectorVestSize}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    sizes: { ...prev.sizes, reflectorVestSize: e.target.value }
                  }))}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                  required
                >
                  <option value="">Select size</option>
                  <option value="S">Small</option>
                  <option value="M">Medium</option>
                  <option value="L">Large</option>
                  <option value="XL">Extra Large</option>
                  <option value="2XL">2XL</option>
                  <option value="3XL">3XL</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Glove Size</label>
                <select
                  value={formData.sizes.gloveSize}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    sizes: { ...prev.sizes, gloveSize: e.target.value }
                  }))}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                  required
                >
                  <option value="">Select size</option>
                  <option value="S">Small</option>
                  <option value="M">Medium</option>
                  <option value="L">Large</option>
                  <option value="XL">Extra Large</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Jacket Size</label>
                <select
                  value={formData.sizes.jacketSize}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    sizes: { ...prev.sizes, jacketSize: e.target.value }
                  }))}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                  required
                >
                  <option value="">Select size</option>
                  <option value="S">Small</option>
                  <option value="M">Medium</option>
                  <option value="L">Large</option>
                  <option value="XL">Extra Large</option>
                  <option value="2XL">2XL</option>
                  <option value="3XL">3XL</option>
                </select>
              </div>
            </div>
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
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployeeModal;