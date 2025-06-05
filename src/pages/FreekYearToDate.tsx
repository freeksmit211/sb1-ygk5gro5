import React, { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, DollarSign, Target, Award, Fuel } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useYearlyBudget } from '../hooks/useYearlyBudget';
import LastThreeMonthsPerformance from '../components/sales/LastThreeMonthsPerformance';
import CurrentMonthGraph from '../components/sales/CurrentMonthGraph';
import { getFuelEntries } from '../services/fuelService';
import { FuelEntry } from '../types/fuel';
import YearToDateFuelUsage from '../components/sales/YearToDateFuelUsage';
import FreekCalendar from '../components/freek/FreekCalendar';
import TodoBoard from '../components/todo/TodoBoard';

const FreekYearToDate: React.FC = () => {
  const navigate = useNavigate();
  const { budget, loading } = useYearlyBudget();
  const [fuelEntries, setFuelEntries] = useState<FuelEntry[]>([]);
  const [loadingFuel, setLoadingFuel] = useState(true);
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear();

  useEffect(() => {
    const loadFuelEntries = async () => {
      try {
        setLoadingFuel(true);
        const entries = await getFuelEntries();
        setFuelEntries(entries);
      } catch (error) {
        console.error('Failed to load fuel entries:', error);
      } finally {
        setLoadingFuel(false);
      }
    };

    loadFuelEntries();
  }, []);

  if (loading || loadingFuel) {
    return (
      <div className="min-h-screen bg-blue-600 p-4 md:p-6 flex justify-center items-start pt-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!budget || !budget.accounts.freek) {
    return (
      <div className="min-h-screen bg-blue-600 p-4 md:p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <p className="text-gray-900 font-medium">No budget data available</p>
        </div>
      </div>
    );
  }

  const freekData = budget.accounts.freek.monthlyData[currentMonth] || {
    target: 0,
    invoiceValue: 0,
    orderValue: 0
  };

  const achievementPercentage = freekData.target > 0 
    ? (freekData.invoiceValue / freekData.target) * 100 
    : 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Calculate current month's fuel usage
  const getCurrentMonthFuelUsage = () => {
    let liters = 0;
    let kilometers = 0;
    let startOdometer = Infinity;
    let endOdometer = 0;

    fuelEntries.forEach(entry => {
      const entryDate = new Date(entry.date);
      if (
        entryDate.getMonth() === currentDate.getMonth() &&
        entryDate.getFullYear() === currentDate.getFullYear() &&
        entry.driver.toLowerCase() === 'freek'
      ) {
        liters += entry.liters;
        
        if (entry.odometer < startOdometer) {
          startOdometer = entry.odometer;
        }
        if (entry.odometer > endOdometer) {
          endOdometer = entry.odometer;
        }
      }
    });

    kilometers = startOdometer === Infinity ? 0 : endOdometer - startOdometer;

    return { liters, kilometers };
  };

  const { liters, kilometers } = getCurrentMonthFuelUsage();

  // Create a modified budget object with only Freek's data
  const freekBudget = {
    year: budget.year,
    accounts: {
      freek: budget.accounts.freek
    }
  };

  return (
    <div className="min-h-screen bg-blue-600 p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/sales-accounts')}
          className="text-white hover:text-blue-100"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white">Freek's Overview</h1>
          <h2 className="text-lg text-blue-100">{currentMonth} {currentYear} Performance</h2>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600">Monthly Target</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(freekData.target)}</p>
            </div>
            <Target className="w-8 h-8 text-blue-600" />
          </div>
          <div className="text-sm text-gray-500">Current month goal</div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600">Invoice Value</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{formatCurrency(freekData.invoiceValue)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
          <div className="text-sm text-gray-500">Total invoiced this month</div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600">Order Value</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">{formatCurrency(freekData.orderValue)}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-600" />
          </div>
          <div className="text-sm text-gray-500">Total orders this month</div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600">Achievement</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">{achievementPercentage.toFixed(1)}%</p>
            </div>
            <Award className="w-8 h-8 text-purple-600" />
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                achievementPercentage >= 100 ? 'bg-green-600' :
                achievementPercentage >= 75 ? 'bg-blue-600' :
                'bg-yellow-600'
              }`}
              style={{ width: `${Math.min(achievementPercentage, 100)}%` }}
            />
          </div>
          <div className="flex justify-end mt-1">
            <span className={`px-2 py-0.5 text-xs rounded-full ${
              achievementPercentage >= 100 ? 'bg-green-100 text-green-800' :
              achievementPercentage >= 75 ? 'bg-blue-100 text-blue-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {achievementPercentage >= 100 ? 'Achieved' :
               achievementPercentage >= 75 ? 'On Track' : 'In Progress'}
            </span>
          </div>
        </div>
      </div>

      {/* Last Three Months Performance */}
      <LastThreeMonthsPerformance budget={freekBudget} />

      {/* Financial Year Performance Graph */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Financial Year Performance (Mar 2024 - Feb 2025)</h2>
        <CurrentMonthGraph budget={freekBudget} />
      </div>

      {/* Current Month Fuel Usage */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Fuel className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">Current Month Fuel Usage</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-blue-600 font-medium">{currentMonth}</p>
                <p className="text-2xl font-bold text-blue-900 mt-1">
                  {liters.toFixed(2)} L
                </p>
              </div>
              <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Fuel className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-blue-600 font-medium">Distance Covered</p>
                <p className="text-2xl font-bold text-blue-900 mt-1">
                  {kilometers.toLocaleString()} km
                </p>
              </div>
              <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold">KM</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Year to Date Fuel Usage */}
      <YearToDateFuelUsage entries={fuelEntries} repId="freek" />

      {/* Activity Calendar */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Activity Calendar</h2>
        <FreekCalendar />
      </div>

      {/* Todo Board */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Todo List</h2>
        <TodoBoard repId="freek" />
      </div>
    </div>
  );
};

export default FreekYearToDate;