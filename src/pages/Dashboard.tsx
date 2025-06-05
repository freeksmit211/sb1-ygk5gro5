import React from 'react';
import { Link } from 'react-router-dom';
import DashboardSection from '../components/DashboardSection';
import { useAuth } from '../contexts/AuthContext';
import { ShieldCheck, Users, Bell, LayoutDashboard, BarChart2, Building2, FileText, ListTodo, Car, FileCheck, AlertTriangle, HardHat, ClipboardList, Truck, Calendar, Package, FileSpreadsheet, Fuel, Wrench, FolderKanban, Shield, Wind, Zap, Fan, PenTool as Tool } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  // Define sections based on role
  const getSectionsForRole = () => {
    switch (user?.role) {
      case 'safety':
        return [
          { title: 'Contact List', icon: Users, href: '/contacts' },
          { title: 'Notice Board', icon: Bell, href: '/notices' }
        ];
      case 'admin':
        return [
          { title: 'Notice Board', icon: Bell, href: '/notices' },
          { title: 'Contact List', icon: Users, href: '/contacts' },
          { title: 'Outstanding Invoices', icon: FileText, href: '/invoices' }
        ];
      case 'salesFranco':
      case 'salesFreek':
      case 'salesJeckie':
        return [
          { title: 'Sales Accounts', icon: BarChart2, href: '/sales-accounts' },
          { title: 'Contact List', icon: Users, href: '/contacts' },
          { title: 'Notice Board', icon: Bell, href: '/notices' },
          { title: 'Outstanding Invoices', icon: FileText, href: '/invoices' }
        ];
      case 'superAdmin':
      case 'management':
        return [
          { title: 'Management Dashboard', icon: LayoutDashboard, href: '/management' },
          { title: 'Management Portal', icon: LayoutDashboard, href: '/management/portal' },
          { title: 'Sales Accounts', icon: BarChart2, href: '/sales-accounts' },
          { title: 'Outstanding Invoices', icon: FileText, href: '/invoices' },
          { title: 'Notice Board', icon: Bell, href: '/notices' },
          { title: 'Contact List', icon: Users, href: '/contacts' }
        ];
      default:
        return [];
    }
  };

  const adminSections = [
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
    },
    { 
      title: 'Order PPE', 
      icon: Shield, 
      href: '/ppe/order',
      description: 'Order personal protective equipment'
    },
    { 
      title: 'Pool Vehicles', 
      icon: Car, 
      href: '/vehicles/pool',
      description: 'Manage pool vehicles'
    },
    { 
      title: 'Outstanding Orders', 
      icon: FileText, 
      href: '/orders/outstanding',
      description: 'View and manage outstanding orders'
    }
  ];

  const vehicleSections = [
    { title: 'Vehicle Register', icon: Car, href: '/vehicles', description: 'View and manage all company vehicles' },
    { title: 'Vehicle Inspections', icon: FileCheck, href: '/vehicles/inspections', description: 'Complete and view inspection reports' },
    { title: 'Service Status', icon: FileText, href: '/vehicles/service', description: 'Monitor vehicle service schedules' },
    { title: 'License Status', icon: FileSpreadsheet, href: '/vehicles/license', description: 'Track vehicle license renewals' },
    { title: 'Fuel Form', icon: Fuel, href: '/forms/fuel', description: 'Record vehicle fuel consumption' }
  ];

  const sheqSections = [
    { title: 'Companies', icon: Building2, href: '/sheq', description: 'Manage company safety files and documentation' },
    { title: 'Incidents', icon: AlertTriangle, href: '/sheq/incidents', description: 'Report and track safety incidents' },
    { title: 'Contractor Packs', icon: HardHat, href: '/sheq/contractor-packs', description: 'Manage contractor safety documentation' },
    { title: 'PPE Register', icon: Shield, href: '/ppe/register', description: 'Manage personal protective equipment' }
  ];

  const stsSections = {
    jobs: [
      { title: 'Job Calendar', icon: ClipboardList, href: '/projects', description: 'View and manage project jobs' },
      { title: 'Jobs To-do', icon: ListTodo, href: '/todo/sts', description: 'Manage STS jobs' }
    ],
    inspections: [
      { title: 'Light Inspection', icon: Wind, href: '/projects/light', description: 'Monthly light inspection schedules' },
      { title: 'Earth Leakage', icon: Zap, href: '/projects/earth', description: 'Earth leakage inspection schedules' },
      { title: 'Aircon Inspection', icon: Fan, href: '/projects/aircon', description: 'Monthly aircon inspection schedules' },
      { title: 'PPE Inspection', icon: Shield, href: '/projects/ppe', description: 'PPE inspection schedules' },
      { title: 'Tool Inspection', icon: Tool, href: '/projects/tools', description: 'Tool inspection schedules' }
    ]
  };

  // If user is a sales rep, show sales-focused dashboard
  if (user?.role && ['salesFranco', 'salesFreek', 'salesJeckie'].includes(user.role)) {
    return (
      <div className="space-y-8">
        {/* Sales Sections */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {getSectionsForRole().map((section) => (
            <Link 
              key={section.title} 
              to={section.href}
              className="block hover:no-underline"
            >
              <DashboardSection
                title={section.title}
                icon={section.icon}
              />
            </Link>
          ))}
        </div>

        {/* Admin Office Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Building2 className="w-8 h-8 text-white" />
            <h2 className="text-2xl font-bold text-white">Admin Office</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {adminSections.map((section) => (
              <Link 
                key={section.title}
                to={section.href}
                className="block hover:no-underline"
              >
                <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all h-full">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <section.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{section.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600">{section.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Main Dashboard Sections */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {getSectionsForRole().map((section) => (
          <Link 
            key={section.title} 
            to={section.href}
            className="block hover:no-underline"
          >
            <DashboardSection
              title={section.title}
              icon={section.icon}
            />
          </Link>
        ))}
      </div>

      {/* Admin Office Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Building2 className="w-8 h-8 text-white" />
          <h2 className="text-2xl font-bold text-white">Admin Office</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {adminSections.map((section) => (
            <Link 
              key={section.title}
              to={section.href}
              className="block hover:no-underline"
            >
              <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all h-full">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <section.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{section.title}</h3>
                </div>
                <p className="text-sm text-gray-600">{section.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Vehicle Management Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Car className="w-8 h-8 text-white" />
          <h2 className="text-2xl font-bold text-white">Vehicle Management</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {vehicleSections.map((section) => (
            <Link 
              key={section.title}
              to={section.href}
              className="block hover:no-underline"
            >
              <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all h-full">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <section.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{section.title}</h3>
                </div>
                <p className="text-sm text-gray-600">{section.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* SHEQ Management Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-white" />
          <h2 className="text-2xl font-bold text-white">SHEQ Management</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {sheqSections.map((section) => (
            <Link 
              key={section.title}
              to={section.href}
              className="block hover:no-underline"
            >
              <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all h-full">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <section.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{section.title}</h3>
                </div>
                <p className="text-sm text-gray-600">{section.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* STS Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <FolderKanban className="w-8 h-8 text-white" />
          <h2 className="text-2xl font-bold text-white">STS</h2>
        </div>

        {/* Jobs Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white">Jobs</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {stsSections.jobs.map((section) => (
              <Link 
                key={section.title}
                to={section.href}
                className="block hover:no-underline"
              >
                <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all h-full">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <section.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{section.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600">{section.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Inspections Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white">Inspections</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {stsSections.inspections.map((section) => (
              <Link 
                key={section.title}
                to={section.href}
                className="block hover:no-underline"
              >
                <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all h-full">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <section.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{section.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600">{section.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;