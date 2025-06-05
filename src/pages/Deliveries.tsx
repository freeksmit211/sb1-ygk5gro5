import React from 'react';
import { Truck, Calendar, Package, FileText, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import DeliveryCalendar from '../components/deliveries/DeliveryCalendar';

const Deliveries: React.FC = () => {
  const adminButtons = [
    { 
      title: 'Deliveries', 
      icon: Truck, 
      href: '/deliveries',
      active: true
    },
    { 
      title: 'Meetings', 
      icon: Calendar, 
      href: '/meetings',
      active: false
    },
    { 
      title: 'Stock Ready', 
      icon: Package, 
      href: '/stock',
      active: false
    },
    { 
      title: 'Items to be Repaired', 
      icon: Wrench, 
      href: '/repairs',
      active: false
    },
    { 
      title: 'Outstanding Invoices', 
      icon: FileText, 
      href: '/invoices',
      active: false
    }
  ];

  return (
    <div className="p-4 md:p-6">
      {/* Admin Navigation Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {adminButtons.map((button) => (
          <Link 
            key={button.title}
            to={button.href}
            className={`flex items-center gap-3 p-4 rounded-lg transition-all ${
              button.active 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'bg-white text-gray-900 hover:bg-gray-50'
            }`}
          >
            <button.icon className={`w-5 h-5 ${button.active ? 'text-white' : 'text-blue-600'}`} />
            <span className="font-medium">{button.title}</span>
          </Link>
        ))}
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
        <DeliveryCalendar />
      </div>
    </div>
  );
};

export default Deliveries;