import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { YearlyBudget, MonthlyBudget } from '../types/budget';
import BudgetRow from '../components/management/BudgetRow';
import SimotechBudgetRow from '../components/management/SimotechBudgetRow';
import AddUserSection from '../components/users/AddUserSection';
import VehicleAllocationSection from '../components/management/VehicleAllocationSection';
import VehicleManagementSection from '../components/management/VehicleManagementSection';
import ReportsSection from '../components/management/ReportsSection';
import { saveAccountBudget, saveSimotechBudget, getYearlyBudget, getSimotechBudget } from '../services/budgetService';
import { SALES_REP_NAMES, SalesRepCode, REP_CODE_TO_ID } from '../types/salesRep';

const INITIAL_BUDGET: MonthlyBudget = { target: 0, invoiceValue: 0, orderValue: 0 };

const ACCOUNT_TITLES: Record<string, string> = {
  inHouse: "In-House Account",
  cod: "COD Account"
};

const ManagementPortal: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [year] = useState(currentYear);
  const [selectedMonths, setSelectedMonths] = useState({
    franco: 'March',
    freek: 'March',
    jeckie: 'March',
    inHouse: 'March',
    cod: 'March'
  });
  const [budget, setBudget] = useState<YearlyBudget>({
    year,
    accounts: {
      franco: { name: 'franco', monthlyData: {} },
      freek: { name: 'freek', monthlyData: {} },
      jeckie: { name: 'jeckie', monthlyData: {} },
      inHouse: { name: 'inHouse', monthlyData: {} },
      cod: { name: 'cod', monthlyData: {} }
    }
  });
  const [simotechBudget, setSimotechBudget] = useState<Record<string, MonthlyBudget>>({});

  useEffect(() => {
    loadBudgets();
  }, [year]);

  const loadBudgets = async () => {
    try {
      const [yearlyBudget, simotechData] = await Promise.all([
        getYearlyBudget(year),
        getSimotechBudget(year)
      ]);

      if (yearlyBudget) {
        setBudget(yearlyBudget);
      }

      if (simotechData) {
        setSimotechBudget({ [year]: simotechData });
      }
    } catch (error) {
      console.error('Error loading budgets:', error);
    }
  };

  const handleMonthChange = (account: string, month: string) => {
    setSelectedMonths(prev => ({
      ...prev,
      [account]: month
    }));
  };

  const handleDataChange = (account: string, data: MonthlyBudget) => {
    const month = selectedMonths[account as keyof typeof selectedMonths];
    setBudget(prev => ({
      ...prev,
      accounts: {
        ...prev.accounts,
        [account]: {
          name: account,
          monthlyData: {
            ...prev.accounts[account as keyof typeof prev.accounts].monthlyData,
            [month]: data
          }
        }
      }
    }));
  };

  const handleSimotechBudgetChange = (data: MonthlyBudget) => {
    setSimotechBudget(prev => ({
      ...prev,
      [year.toString()]: data
    }));
  };

  const handleSave = async (account: string) => {
    try {
      await saveAccountBudget(
        year,
        account,
        budget.accounts[account as keyof typeof budget.accounts].monthlyData
      );
      alert(`Budget for ${getAccountTitle(account)} saved successfully!`);
    } catch (error) {
      console.error(`Failed to save budget for ${account}:`, error);
      alert(`Failed to save budget for ${getAccountTitle(account)}. Please try again.`);
    }
  };

  const handleSimotechBudgetSave = async () => {
    try {
      const monthlyData = simotechBudget[year.toString()];
      if (monthlyData) {
        await saveSimotechBudget(year, monthlyData);
        alert('Simotech yearly budget saved successfully!');
      }
    } catch (error) {
      console.error('Failed to save Simotech yearly budget:', error);
      alert('Failed to save Simotech yearly budget. Please try again.');
    }
  };

  const getAccountTitle = (account: string): string => {
    if (account === 'inHouse' || account === 'cod') {
      return ACCOUNT_TITLES[account];
    }

    // Find the sales rep code for this account
    const repCode = Object.entries(REP_CODE_TO_ID).find(([_, id]) => 
      id === account
    )?.[0] as SalesRepCode;

    if (repCode) {
      return `${SALES_REP_NAMES[repCode]} (${repCode})`;
    }

    return account;
  };

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Link
            to="/management"
            className="flex items-center gap-2 text-white hover:text-blue-100"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-white">Management Portal</h1>
        </div>
      </div>

      {/* Reports Section */}
      <ReportsSection />

      {/* Budget Management */}
      <div>
        <h2 className="text-xl font-bold bg-gray-100 text-gray-800 mb-4 p-4 rounded-lg">
          Budget Management
        </h2>

        <div className="space-y-4">
          <SimotechBudgetRow
            year={year}
            data={simotechBudget[year.toString()] || INITIAL_BUDGET}
            onDataChange={handleSimotechBudgetChange}
            onSave={handleSimotechBudgetSave}
          />

          {Object.entries(budget.accounts).map(([key, account]) => (
            <BudgetRow
              key={key}
              title={getAccountTitle(key)}
              month={selectedMonths[key as keyof typeof selectedMonths]}
              data={account.monthlyData[selectedMonths[key as keyof typeof selectedMonths]] || INITIAL_BUDGET}
              onMonthChange={(month) => handleMonthChange(key, month)}
              onDataChange={(data) => handleDataChange(key, data)}
              onSave={() => handleSave(key)}
              accountId={key}
            />
          ))}
        </div>
      </div>

      {/* Vehicle Management Section */}
      <VehicleManagementSection />

      {/* Vehicle Allocation Section */}
      <VehicleAllocationSection />

      {/* User Management */}
      <AddUserSection />
    </div>
  );
};

export default ManagementPortal;