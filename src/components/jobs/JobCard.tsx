import React from 'react';
import { Job } from '../../types/job';
import { Clock, Users, Building2 } from 'lucide-react';

interface JobCardProps {
  job: Job;
  onClick: (job: Job) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onClick }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent calendar cell click
    onClick(job);
  };

  const getStatusColor = (status: Job['status']) => {
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

  const getPriorityColor = (priority: Job['priority']) => {
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
    <div 
      className={`text-xs p-2 rounded ${getStatusColor(job.status)} cursor-pointer hover:opacity-90`}
      onClick={handleClick}
    >
      {job.jobCardNumber && (
        <div className="text-xs font-medium mb-1">Card #{job.jobCardNumber}</div>
      )}
      <div className="font-medium">{job.title}</div>
      <div className="text-xs opacity-75">{job.client}</div>
      <div className="flex items-center justify-between mt-1">
        <div className="flex items-center gap-1">
          <Clock className={`w-3 h-3 ${getPriorityColor(job.priority)}`} />
          <span className={getPriorityColor(job.priority)}>{job.priority}</span>
        </div>
        <div className="flex items-center gap-1">
          <Building2 className="w-3 h-3" />
          <span>{job.client}</span>
        </div>
      </div>
    </div>
  );
};

export default JobCard;