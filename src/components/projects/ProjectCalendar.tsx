import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import ProjectModal from './ProjectModal';
import { Project } from '../../types/project';
import { getProjectsByDate } from '../../services/projectService';
import ProjectCard from './ProjectCard';

const ProjectCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [projects, setProjects] = useState<Record<string, Project[]>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, [currentDate]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      const monthProjects = await getProjectsByDate(startOfMonth, endOfMonth);
      
      const grouped = monthProjects.reduce((acc, project) => {
        const date = new Date(project.startDate).toISOString().split('T')[0];
        acc[date] = [...(acc[date] || []), project];
        return acc;
      }, {} as Record<string, Project[]>);
      
      setProjects(grouped);
    } catch (error) {
      console.error('Failed to load projects:', error);
      setProjects({});
    } finally {
      setLoading(false);
    }
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const renderCalendar = () => {
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-32" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateString = date.toISOString().split('T')[0];
      const dayProjects = projects[dateString] || [];

      days.push(
        <div
          key={day}
          onClick={() => handleDateClick(date)}
          className="border border-gray-200 p-2 h-32 hover:bg-gray-50 cursor-pointer relative group overflow-auto"
        >
          <div className="font-semibold mb-1 flex justify-between items-center sticky top-0 bg-white">
            <span>{day}</span>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity">
              <Plus className="w-4 h-4 text-blue-600" />
            </span>
          </div>
          <div className="space-y-1">
            {dayProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      );
    }

    return days;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-700">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={handlePrevMonth}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="bg-gray-100 p-2 text-center font-semibold">
            {day}
          </div>
        ))}
        {renderCalendar()}
      </div>

      {selectedDate && (
        <ProjectModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedDate(null);
          }}
          date={selectedDate}
          onProjectAdded={loadProjects}
        />
      )}
    </div>
  );
};

export default ProjectCalendar;