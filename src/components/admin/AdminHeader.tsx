import React from 'react';
import { Building2, Truck, Calendar, Package, FileText, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminHeader: React.FC = () => {
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
    <div className="flex items-center gap-3 mb-6">
      <Building2 className="w-8 h-8 text-white" />
      <h1 className="text-2xl font-bold text-white">Admin Office</h1>
    </div>
  );
};

export default AdminHeader;