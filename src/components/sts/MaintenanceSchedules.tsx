import React from 'react';
import { Lightbulb, Wind, Zap, Shield } from 'lucide-react';
import MaintenanceScheduleCard from './MaintenanceScheduleCard';

interface MaintenanceSchedulesProps {
  initialType: 'light' | 'aircon' | 'earth' | 'ppe';
}

const MaintenanceSchedules: React.FC<MaintenanceSchedulesProps> = ({ initialType }) => {
  const schedules = {
    light: {
      title: 'Light Inspection Schedule',
      icon: Lightbulb,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      description: 'Monthly inspection of all lighting systems including emergency lights, outdoor lighting, and general illumination.',
      tasks: [
        'Check all light fixtures for proper operation',
        'Inspect emergency lighting systems',
        'Test backup power systems for emergency lights',
        'Check outdoor lighting timers and sensors',
        'Replace any burnt-out bulbs',
        'Clean light fixtures and diffusers',
        'Check wiring and connections',
        'Verify proper light levels in all areas'
      ],
      type: 'light' as const
    },
    aircon: {
      title: 'Aircon Inspection Schedule',
      icon: Wind,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      description: 'Regular inspection and maintenance of air conditioning systems to ensure optimal performance and efficiency.',
      tasks: [
        'Clean or replace air filters',
        'Check refrigerant levels',
        'Inspect and clean condenser coils',
        'Test thermostat operation',
        'Check electrical connections',
        'Inspect drain lines and pans',
        'Verify proper airflow',
        'Check compressor operation'
      ],
      type: 'aircon' as const
    },
    earth: {
      title: 'Earth Leakage Inspection Schedule',
      icon: Zap,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      description: 'Regular testing and inspection of earth leakage protection systems to ensure electrical safety.',
      tasks: [
        'Test earth leakage protection devices',
        'Check earth continuity',
        'Inspect main earth connections',
        'Test RCD operation',
        'Check insulation resistance',
        'Verify proper grounding',
        'Inspect distribution boards',
        'Document test results'
      ],
      type: 'earth' as const
    },
    ppe: {
      title: 'PPE Inspection Schedule',
      icon: Shield,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      description: 'Regular inspection of personal protective equipment to ensure safety compliance and equipment integrity.',
      tasks: [
        'Inspect hard hats for cracks or damage',
        'Check safety glasses for scratches or defects',
        'Verify ear protection equipment condition',
        'Inspect high-visibility clothing',
        'Check safety boots/shoes condition',
        'Verify gloves integrity and condition',
        'Inspect fall protection equipment',
        'Check respiratory protection equipment',
        'Verify first aid kit contents',
        'Document equipment condition'
      ],
      type: 'ppe' as const
    }
  };

  return (
    <div className="space-y-6">
      <MaintenanceScheduleCard {...schedules[initialType]} />
    </div>
  );
};

export default MaintenanceSchedules;