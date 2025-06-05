import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface DashboardSectionProps {
  title: string;
  icon: LucideIcon;
}

const DashboardSection: React.FC<DashboardSectionProps> = ({ title, icon: Icon }) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg bg-white p-4 md:p-6 shadow-sm transition-all hover:shadow-md text-center">
      <Icon className="h-6 w-6 md:h-8 md:w-8 text-blue-600 mb-2 md:mb-3" />
      <h2 className="text-base md:text-lg font-medium text-gray-900">{title}</h2>
    </div>
  );
};

export default DashboardSection;