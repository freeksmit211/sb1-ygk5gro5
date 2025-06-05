import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import DashboardMetrics from '../components/management/DashboardMetrics';
import FuelUsageSection from '../components/management/FuelUsageSection';
import SalesRepFeedbackSections from '../components/management/SalesRepFeedbackSections';
import TodoBoardsSection from '../components/management/TodoBoardsSection';
import { useYearlyBudget } from '../hooks/useYearlyBudget';
import { Link } from 'react-router-dom';

const ManagementNew: React.FC = () => {
  const { budget, loading, error, refetch } = useYearlyBudget();
  const [retryCount, setRetryCount] = useState(0);
  const [localBudget, setLocalBudget] = useState(budget);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    const fetchData = async () => {
      if (!localBudget) {
        try {
          const result = await refetch();
          if (mountedRef.current) {
            setLocalBudget(result);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };

    fetchData();

    return () => {
      mountedRef.current = false;
    };
  }, [refetch, localBudget]);

  useEffect(() => {
    if (budget && mountedRef.current) {
      setLocalBudget(budget);
    }
  }, [budget]);

  const handleRetry = async () => {
    if (mountedRef.current) {
      setRetryCount(prev => prev + 1);
      try {
        const result = await refetch();
        if (mountedRef.current) {
          setLocalBudget(result);
        }
      } catch (error) {
        console.error('Error retrying fetch:', error);
      }
    }
  };

  if (loading && retryCount === 0) {
    return (
      <div className="min-h-screen bg-blue-600 p-4 md:p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error || !localBudget) {
    return (
      <div className="min-h-screen bg-blue-600 p-4 md:p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <p className="text-gray-900 font-medium mb-4">
            {error || 'Failed to load dashboard data'}
          </p>
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-600 p-4 md:p-6">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-xl md:text-2xl font-bold text-white">Management Dashboard (New)</h1>
          <Link
            to="/management/portal"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <span>Go to Portal</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Management Dashboard */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <DashboardMetrics budget={localBudget} />
        </div>

        {/* Sales Rep Feedback */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <SalesRepFeedbackSections />
        </div>

        {/* Todo Boards */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <TodoBoardsSection />
        </div>

        {/* Fuel Usage Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <FuelUsageSection />
        </div>
      </div>
    </div>
  );
};

export default ManagementNew;