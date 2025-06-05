import React, { useState, useEffect, useRef } from 'react';
import { Bell, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardMetrics from '../components/management/DashboardMetrics';
import FuelUsageSection from '../components/management/FuelUsageSection';
import SalesRepFeedbackSections from '../components/management/SalesRepFeedbackSections';
import TodoBoardsSection from '../components/management/TodoBoardsSection';
import { useYearlyBudget } from '../hooks/useYearlyBudget';

const Management: React.FC = () => {
  const { budget, loading, error, refetch } = useYearlyBudget();
  const [retryCount, setRetryCount] = useState(0);
  const [localBudget, setLocalBudget] = useState(budget);
  const mountedRef = useRef(true);

  // Sample notifications data - replace with real data in production
  const notifications = [
    {
      id: 1,
      title: 'Outstanding Invoice',
      message: '1 invoice requires attention',
      type: 'danger',
      link: '/invoices'
    },
    {
      id: 2,
      title: 'Vehicle Service Due',
      message: 'KZW 922 MP is due for service',
      type: 'warning',
      link: '/vehicles/service'
    },
    {
      id: 3,
      title: 'SHEQ Document Expiring',
      message: 'Safety file expires in 30 days',
      type: 'warning',
      link: '/sheq'
    }
  ];

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
        <h1 className="text-xl md:text-2xl font-bold text-white">Management Dashboard</h1>

        {/* Notifications Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Bell className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Recent Notifications</h2>
            </div>
            <Link
              to="/notifications"
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-3">
            {notifications.map(notification => (
              <Link
                key={notification.id}
                to={notification.link}
                className={`block p-4 rounded-lg border ${
                  notification.type === 'danger' 
                    ? 'bg-red-50 border-red-100' 
                    : 'bg-yellow-50 border-yellow-100'
                } hover:opacity-90 transition-opacity`}
              >
                <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                <p className="text-sm text-gray-600 mt-0.5">{notification.message}</p>
              </Link>
            ))}
          </div>
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

export default Management;