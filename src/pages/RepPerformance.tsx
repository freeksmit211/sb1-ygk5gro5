import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useYearlyBudget } from '../hooks/useYearlyBudget';
import RepPerformanceGraph from '../components/sales/RepPerformanceGraph';
import MonthlyPerformanceMetrics from '../components/sales/MonthlyPerformanceMetrics';
import RepPerformanceStock from '../components/sales/RepPerformanceStock';
import RepFeedbackSection from '../components/sales/RepFeedbackSection';
import DieselUsageGraph from '../components/sales/DieselUsageGraph';
import CurrentMonthDiesel from '../components/sales/CurrentMonthDiesel';
import FrancoCalendar from '../components/franco/FrancoCalendar';
import FreekCalendar from '../components/freek/FreekCalendar';
import JeckieCalendar from '../components/jeckie/JeckieCalendar';
import SalesCalendar from '../components/sales/SalesCalendar';
import { getFuelEntries } from '../services/fuelService';
import { FuelEntry } from '../types/fuel';

const RepPerformance: React.FC = () => {
  const { repId } = useParams();
  const { budget, loading } = useYearlyBudget();
  const [fuelEntries, setFuelEntries] = useState<FuelEntry[]>([]);
  const [loadingFuel, setLoadingFuel] = useState(true);

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
      <div className="p-6 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!budget || !repId || !budget.accounts[repId as keyof typeof budget.accounts]) {
    return <div className="p-6 text-white">Rep not found</div>;
  }

  const repName = repId.charAt(0).toUpperCase() + repId.slice(1);
  const repData = budget.accounts[repId as keyof typeof budget.accounts];

  const renderCalendar = () => {
    switch (repId) {
      case 'franco':
        return <FrancoCalendar />;
      case 'freek':
        return <FreekCalendar />;
      case 'jeckie':
        return <JeckieCalendar />;
      default:
        return <SalesCalendar repId={repId} />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-white">{repName}'s Performance</h1>
      <RepPerformanceGraph data={repData.monthlyData} repName={repName} />
      <MonthlyPerformanceMetrics data={repData.monthlyData} />
      {['franco', 'freek', 'jeckie'].includes(repId) && (
        <>
          <CurrentMonthDiesel entries={fuelEntries} repId={repId} />
          <DieselUsageGraph entries={fuelEntries} repId={repId} />
          <RepPerformanceStock repId={repId} repName={repName} />
          <RepFeedbackSection repId={repId} repName={repName} />
          {renderCalendar()}
        </>
      )}
    </div>
  );
};

export default RepPerformance;