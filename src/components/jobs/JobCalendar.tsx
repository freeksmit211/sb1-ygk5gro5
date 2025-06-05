import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import JobModal from './JobModal';
import JobDetailsModal from './JobDetailsModal';
import { getJobsByDate } from '../../services/jobService';
import { Job } from '../../types/job';
import JobCard from './JobCard';

interface JobCalendarProps {
  onDateSelect?: (date: Date) => void;
}

const JobCalendar: React.FC<JobCalendarProps> = ({ onDateSelect }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [jobs, setJobs] = useState<Record<string, Job[]>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJobs();
  }, [currentDate]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      const monthJobs = await getJobsByDate(startOfMonth, endOfMonth);
      
      const grouped = monthJobs.reduce((acc, job) => {
        const date = new Date(job.jobDate).toISOString().split('T')[0];
        acc[date] = [...(acc[date] || []), job];
        return acc;
      }, {} as Record<string, Job[]>);
      
      setJobs(grouped);
    } catch (error) {
      console.error('Failed to load jobs:', error);
      setJobs({});
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
    if (onDateSelect) {
      onDateSelect(date);
    } else {
      setIsModalOpen(true);
    }
  };

  const handleJobClick = (job: Job) => {
    setSelectedJob(job);
    setIsDetailsModalOpen(true);
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
      const dayJobs = jobs[dateString] || [];

      days.push(
        <div
          key={day}
          onClick={() => handleDateClick(date)}
          className="border border-gray-200 p-2 h-32 hover:bg-gray-50 cursor-pointer relative group overflow-auto"
        >
          <div className="font-semibold mb-1 flex justify-between items-center sticky top-0 bg-white z-10">
            <span>{day}</span>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity">
              <Plus className="w-4 h-4 text-blue-600" />
            </span>
          </div>
          <div className="space-y-1">
            {dayJobs.map((job) => (
              <JobCard 
                key={job.id} 
                job={job} 
                onClick={() => handleJobClick(job)}
              />
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
    <div className="job-calendar">
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

      {selectedDate && !onDateSelect && (
        <JobModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedDate(null);
          }}
          date={selectedDate}
          onJobAdded={loadJobs}
        />
      )}

      {selectedJob && (
        <JobDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedJob(null);
          }}
          job={selectedJob}
          onJobUpdated={loadJobs}
        />
      )}
    </div>
  );
};

export default JobCalendar;