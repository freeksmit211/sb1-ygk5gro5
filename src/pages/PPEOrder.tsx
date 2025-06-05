import React, { useState } from 'react';
import { ArrowLeft, Shield, Plus, Search, User, Download, Send, Pencil, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import AddEmployeeModal from '../components/ppe/AddEmployeeModal';
import EditEmployeeModal from '../components/ppe/EditEmployeeModal';

interface Employee {
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
}

interface PPEOrderItem {
  type: string;
  size: string;
  quantity: number;
}

const PPEOrder: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [orderItems, setOrderItems] = useState<PPEOrderItem[]>([]);
  const [notes, setNotes] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);

  const handleAddEmployee = (data: {
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
  }) => {
    const newEmployee: Employee = {
      id: crypto.randomUUID(),
      ...data
    };
    setEmployees(prev => [...prev, newEmployee]);
  };

  const handleEditEmployee = (id: string, data: {
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
  }) => {
    setEmployees(prev => prev.map(emp => 
      emp.id === id ? { ...emp, ...data } : emp
    ));
  };

  const handleDeleteEmployee = (id: string) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      setEmployees(prev => prev.filter(emp => emp.id !== id));
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Add header
    doc.setFontSize(20);
    doc.text('PPE Order Form', 20, 20);
    
    // Add employee details
    doc.setFontSize(12);
    if (selectedEmployee) {
      const details = [
        ['Employee:', selectedEmployee.name],
        ['Department:', selectedEmployee.department],
        ['Shoe Size:', selectedEmployee.sizes.shoeSize],
        ['Pants Size:', selectedEmployee.sizes.pantsSize],
        ['Hard Hat Size:', selectedEmployee.sizes.hardHatSize],
        ['Reflector Vest Size:', selectedEmployee.sizes.reflectorVestSize],
        ['Glove Size:', selectedEmployee.sizes.gloveSize],
        ['Jacket Size:', selectedEmployee.sizes.jacketSize]
      ];

      (doc as any).autoTable({
        startY: 30,
        body: details,
        theme: 'plain',
        styles: { fontSize: 12 },
        columnStyles: {
          0: { fontStyle: 'bold', cellWidth: 80 },
          1: { cellWidth: 100 }
        }
      });
    }

    // Add order items
    if (orderItems.length > 0) {
      const items = orderItems.map(item => [
        item.type,
        item.size,
        item.quantity.toString()
      ]);

      (doc as any).autoTable({
        startY: (doc as any).lastAutoTable.finalY + 20,
        head: [['Item', 'Size', 'Quantity']],
        body: items,
        theme: 'striped',
        headStyles: { fillColor: [59, 130, 246] }
      });
    }

    // Add notes if any
    if (notes) {
      doc.text('Notes:', 20, (doc as any).lastAutoTable.finalY + 20);
      doc.setFontSize(10);
      doc.text(notes, 20, (doc as any).lastAutoTable.finalY + 30);
    }

    // Save the PDF
    doc.save(`ppe-order-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const sendOrderEmail = () => {
    const mailtoLink = `mailto:chanell.geldenhuys@simotech.com?subject=PPE Order Request&body=${encodeURIComponent(`
PPE Order Request

Employee: ${selectedEmployee?.name}
Department: ${selectedEmployee?.department}

Order Items:
${orderItems.map(item => `- ${item.type} (Size: ${item.size}, Quantity: ${item.quantity})`).join('\n')}

Notes:
${notes}
    `)}`;

    window.location.href = mailtoLink;
  };

  const filteredEmployees = employees.filter(employee => {
    const searchLower = searchQuery.toLowerCase();
    return (
      employee.name.toLowerCase().includes(searchLower) ||
      employee.department.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin')}
          className="text-white hover:text-blue-100"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-white">Order PPE</h1>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Employee PPE Sizes</h2>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-5 h-5" />
              <span>Add Employee</span>
            </button>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by employee name or department..."
              className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map(employee => (
              <div key={employee.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-blue-600" />
                    <div>
                      <h3 className="font-semibold text-gray-900">{employee.name}</h3>
                      <p className="text-sm text-gray-500">{employee.department}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingEmployee(employee);
                        setIsEditModalOpen(true);
                      }}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="Edit employee"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteEmployee(employee.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded-lg"
                      title="Delete employee"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-gray-500">Shoe Size:</div>
                    <div className="text-gray-900">{employee.sizes.shoeSize}</div>
                    
                    <div className="text-gray-500">Pants Size:</div>
                    <div className="text-gray-900">{employee.sizes.pantsSize}</div>
                    
                    <div className="text-gray-500">Hard Hat:</div>
                    <div className="text-gray-900">{employee.sizes.hardHatSize}</div>
                    
                    <div className="text-gray-500">Reflector Vest:</div>
                    <div className="text-gray-900">{employee.sizes.reflectorVestSize}</div>
                    
                    <div className="text-gray-500">Gloves:</div>
                    <div className="text-gray-900">{employee.sizes.gloveSize}</div>
                    
                    <div className="text-gray-500">Jacket:</div>
                    <div className="text-gray-900">{employee.sizes.jacketSize}</div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t flex justify-between">
                  <button
                    onClick={() => {
                      setSelectedEmployee(employee);
                      generatePDF();
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedEmployee(employee);
                      sendOrderEmail();
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Send className="w-4 h-4" />
                    <span>Order PPE</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500">
              {searchQuery ? 'No matching employees found' : 'No employees added yet'}
            </div>
          )}
        </div>
      </div>

      <AddEmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddEmployee}
      />

      {editingEmployee && (
        <EditEmployeeModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingEmployee(null);
          }}
          employee={editingEmployee}
          onSubmit={handleEditEmployee}
        />
      )}
    </div>
  );
};

export default PPEOrder;