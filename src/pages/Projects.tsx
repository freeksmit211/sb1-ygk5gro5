import React from 'react';
import { Calendar, ListTodo } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import JobCalendar from '../components/jobs/JobCalendar';
import TodoBoard from '../components/todo/TodoBoard';

const Projects: React.FC = () => {
  const location = useLocation();

  const stsSections = [
    { 
      id: 'jobs',
      title: 'Job Calendar',
      icon: Calendar, 
      description: 'View and manage project jobs',
      href: '/projects',
      active: location.pathname === '/projects'
    },
    { 
      id: 'tasks',
      title: 'Jobs To-do',
      icon: ListTodo, 
      description: 'Manage STS jobs',
      href: '/todo/sts',
      active: location.pathname === '/todo/sts'
    }
  ];

  const renderActiveSection = () => {
    switch (location.pathname) {
      case '/projects':
        return (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Job Calendar</h2>
            </div>
            <JobCalendar />
          </div>
        );
      case '/todo/sts':
        return (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <ListTodo className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Jobs To-do</h2>
            </div>
            <TodoBoard repId="sts" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* STS Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stsSections.map((section) => (
          <Link 
            key={section.id}
            to={section.href}
            className={`flex items-center gap-3 p-4 rounded-lg transition-all ${
              section.active 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'bg-white text-gray-900 hover:bg-gray-50'
            }`}
          >
            <section.icon className={`w-5 h-5 ${section.active ? 'text-white' : 'text-blue-600'}`} />
            <div>
              <span className="font-medium">{section.title}</span>
              <p className="text-sm opacity-75 mt-1">{section.description}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Main Content */}
      {renderActiveSection()}
    </div>
  );
};

export default Projects;