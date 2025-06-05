import React from 'react';
import { ArrowLeft, Wind, Zap, Calendar, ListTodo, Fan, Shield, PenTool as Tool } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import MaintenanceSchedules from '../components/sts/MaintenanceSchedules';

const LightInspection: React.FC = () => {
  const navigate = useNavigate();

  const stsSections = [
    { 
      id: 'light-inspection',
      title: 'Light Inspection',
      icon: Wind, 
      description: 'Monthly light inspection schedules',
      href: '/projects/light',
      active: true
    },
    { 
      id: 'earth-leakage',
      title: 'Earth Leakage',
      icon: Zap, 
      description: 'Earth leakage inspection schedules',
      href: '/projects/earth',
      active: false
    },
    { 
      id: 'aircon-inspection',
      title: 'Aircon Inspection',
      icon: Fan, 
      description: 'Monthly aircon inspection schedules',
      href: '/projects/aircon',
      active: false
    },
    { 
      id: 'ppe-inspection',
      title: 'PPE Inspection',
      icon: Shield, 
      description: 'PPE inspection schedules',
      href: '/projects/ppe',
      active: false
    },
    { 
      id: 'tool-inspection',
      title: 'Tool Inspection',
      icon: Tool, 
      description: 'Tool inspection schedules',
      href: '/projects/tools',
      active: false
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Inspection Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stsSections.map((section) => (
          <Link 
            key={section.id}
            to={section.href}
            className={`flex items-center gap-3 p-4 rounded-lg transition-all ${
              section.active 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'bg-white text-gray-900 hover:bg-gray-50'
            }`}
          >
            <section.icon className={`w-5 h-5 ${section.active ? 'text-white' : 'text-blue-600'}`} />
            <div>
              <span className="font-medium">{section.title}</span>
              <p className="text-sm opacity-75 mt-1">{section.description}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Wind className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">Light Inspection Schedule</h2>
        </div>
        <MaintenanceSchedules initialType="light" />
      </div>
    </div>
  );
};

export default LightInspection;