import React from 'react';
import { Project } from '../../types/project';
import { Clock, Users } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'planned':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'on-hold':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: Project['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className={`text-xs p-2 rounded ${getStatusColor(project.status)}`}>
      <div className="font-medium">{project.title}</div>
      <div className="text-xs opacity-75">{project.client}</div>
      <div className="flex items-center justify-between mt-1">
        <div className="flex items-center gap-1">
          <Clock className={`w-3 h-3 ${getPriorityColor(project.priority)}`} />
          <span className={getPriorityColor(project.priority)}>{project.priority}</span>
        </div>
        <div className="flex items-center gap-1">
          <Users className="w-3 h-3" />
          <span>{project.assignedTo.length}</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;