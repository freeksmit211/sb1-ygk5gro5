import React, { useState, useEffect } from 'react';
import { Building2, Truck, Calendar, Package, FileText, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import DeliveryCalendar from '../components/deliveries/DeliveryCalendar';
import MeetingCalendar from '../components/meetings/MeetingCalendar';
import StockList from '../components/stock/StockList';

const Admin: React.FC = () => {
  const adminButtons = [
    { 
      title: 'Deliveries', 
      icon: Truck, 
      href: '/deliveries',
      description: 'View delivery schedules'
    },
    { 
      title: 'Meetings', 
      icon: Calendar, 
      href: '/meetings',
      description: 'View meetings schedule'
    },
    { 
      title: 'Stock Ready', 
      icon: Package, 
      href: '/stock',
      description: 'View stock items'
    },
    { 
      title: 'Items to be Repaired', 
      icon: Wrench, 
      href: '/repairs',
      description: 'Track items needing repair'
    },
    { 
      title: 'Outstanding Invoices', 
      icon: FileText, 
      href: '/invoices',
      description: 'Submit and track outstanding invoices'
    }
  ];

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center gap-3 mb-6">
        <Building2 className="w-8 h-8 text-white" />
        <h1 className="text-2xl font-bold text-white">Admin Office</h1>
      </div>

      {/* Admin Navigation Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {adminButtons.map((button) => (
          <Link 
            key={button.title}
            to={button.href}
            className="block hover:no-underline"
          >
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all h-full">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <button.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{button.title}</h3>
              </div>
              <p className="text-sm text-gray-600">{button.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Admin;