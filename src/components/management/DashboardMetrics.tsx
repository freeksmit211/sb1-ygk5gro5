import React from 'react';
import { 
  TrendingUp, Users, Package, FileText, 
  Truck, Calendar, Car, FileCheck, 
  HardHat, ClipboardList, Wind, Zap, ListChecks,
  Building2, FileSpreadsheet, Fuel, Award, Wrench
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { YearlyBudget } from '../../types/budget';
import CollectivePerformanceGraph from './CollectivePerformanceGraph';

interface DashboardMetricsProps {
  budget: YearlyBudget;
}

const DashboardMetrics: React.FC<DashboardMetricsProps> = ({ budget }) => {
  const calculateTotalSales = () => {
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    return Object.values(budget.accounts).reduce((total, account) => {
      const monthData = account.monthlyData[currentMonth];
      return total + (monthData?.invoiceValue || 0);
    }, 0);
  };

  const calculateTotalOrders = () => {
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    return Object.values(budget.accounts).reduce((total, account) => {
      const monthData = account.monthlyData[currentMonth];
      return total + (monthData?.orderValue || 0);
    }, 0);
  };

  const calculateTargetAchievement = () => {
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    const totalTarget = Object.values(budget.accounts).reduce((total, account) => {
      const monthData = account.monthlyData[currentMonth];
      return total + (monthData?.target || 0);
    }, 0);

    const totalSales = calculateTotalSales();
    return totalTarget > 0 ? (totalSales / totalTarget) * 100 : 0;
  };

  const calculateOrderAchievement = () => {
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    const totalTarget = Object.values(budget.accounts).reduce((total, account) => {
      const monthData = account.monthlyData[currentMonth];
      return total + (monthData?.target || 0);
    }, 0);

    const totalOrders = calculateTotalOrders();
    return totalTarget > 0 ? (totalOrders / totalTarget) * 100 : 0;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const cardClasses = "bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all h-[160px] flex flex-col justify-between";
  const secondaryCardClasses = "bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all h-[140px] flex flex-col justify-between";

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold bg-gray-100 text-gray-800 p-4 rounded-lg">
        Management Dashboard
      </h2>

      {/* Primary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Monthly Sales */}
        <div className={cardClasses}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Sales</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900">{formatCurrency(calculateTotalSales())}</p>
            </div>
            <div className="rounded-full bg-blue-50 p-3">
              <span className="text-xl font-bold text-blue-600">R</span>
            </div>
          </div>
          <div>
            <span className={`text-sm font-medium ${
              calculateTargetAchievement() >= 100 ? 'text-green-600' : 'text-yellow-600'
            }`}>
              {calculateTargetAchievement().toFixed(1)}% of target
            </span>
          </div>
        </div>

        {/* Monthly Orders */}
        <div className={cardClasses}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Orders</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900">{formatCurrency(calculateTotalOrders())}</p>
            </div>
            <div className="rounded-full bg-orange-50 p-3">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div>
            <span className={`text-sm font-medium ${
              calculateOrderAchievement() >= 100 ? 'text-green-600' : 'text-yellow-600'
            }`}>
              {calculateOrderAchievement().toFixed(1)}% of target
            </span>
          </div>
        </div>

        {/* Outstanding Orders */}
        <Link to="/orders/outstanding" className="block hover:no-underline">
          <div className={cardClasses}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Outstanding Orders</p>
                <p className="mt-2 text-3xl font-semibold text-gray-900">5</p>
              </div>
              <div className="rounded-full bg-red-50 p-3">
                <FileText className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <div>
              <span className="text-sm text-red-600">2 orders overdue</span>
            </div>
          </div>
        </Link>

        {/* Active Sales Reps */}
        <Link to="/sales-rep-allocation" className="block hover:no-underline">
          <div className={cardClasses}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Sales Reps</p>
                <p className="mt-2 text-3xl font-semibold text-gray-900">3</p>
              </div>
              <div className="rounded-full bg-green-50 p-3">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div>
              <span className="text-sm text-gray-600">SO1, SO3, SO5</span>
            </div>
          </div>
        </Link>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Today's Deliveries */}
        <Link to="/deliveries" className="block hover:no-underline">
          <div className={secondaryCardClasses}>
            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Today's Deliveries</h3>
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">3</p>
              <p className="text-sm text-gray-600">Scheduled for today</p>
            </div>
          </div>
        </Link>

        {/* Upcoming Meetings */}
        <Link to="/meetings" className="block hover:no-underline">
          <div className={secondaryCardClasses}>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold text-gray-900">Upcoming Meetings</h3>
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">4</p>
              <p className="text-sm text-gray-600">Next 7 days</p>
            </div>
          </div>
        </Link>

        {/* Vehicle Service */}
        <Link to="/vehicles/service" className="block hover:no-underline">
          <div className={secondaryCardClasses}>
            <div className="flex items-center gap-3">
              <Car className="h-5 w-5 text-red-600" />
              <h3 className="font-semibold text-gray-900">Service Status</h3>
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">2</p>
              <p className="text-sm text-red-600">Vehicles due for service</p>
            </div>
          </div>
        </Link>

        {/* License Status */}
        <Link to="/vehicles/license" className="block hover:no-underline">
          <div className={secondaryCardClasses}>
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="h-5 w-5 text-orange-600" />
              <h3 className="font-semibold text-gray-900">License Status</h3>
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">3</p>
              <p className="text-sm text-orange-600">Licenses expiring soon</p>
            </div>
          </div>
        </Link>

        {/* SHEQ */}
        <Link to="/sheq" className="block hover:no-underline">
          <div className={secondaryCardClasses}>
            <div className="flex items-center gap-3">
              <HardHat className="h-5 w-5 text-yellow-600" />
              <h3 className="font-semibold text-gray-900">SHEQ</h3>
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">5</p>
              <p className="text-sm text-yellow-600">Documents expiring soon</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Collective Performance Graph */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">YTD Performance</h2>
        <CollectivePerformanceGraph budget={budget} />
      </div>
    </div>
  );
};

export default DashboardMetrics;