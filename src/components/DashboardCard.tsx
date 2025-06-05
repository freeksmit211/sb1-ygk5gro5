import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  link?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  link
}) => {
  const CardContent = () => (
    <div className="rounded-lg bg-white p-6 shadow hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
        </div>
        <div className="rounded-full bg-blue-50 p-3">
          <Icon className="h-6 w-6 text-blue-600" />
        </div>
      </div>
      {trend && (
        <div className="mt-4">
          <span
            className={`text-sm font-medium ${
              trend.value >= 0 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {trend.value >= 0 ? '+' : ''}
            {trend.value}%
          </span>
          <span className="ml-2 text-sm text-gray-600">{trend.label}</span>
        </div>
      )}
    </div>
  );

  if (link) {
    return (
      <Link to={link} className="block hover:no-underline">
        <CardContent />
      </Link>
    );
  }

  return <CardContent />;
};

export default DashboardCard;