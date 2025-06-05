import React, { useState } from 'react';
import { Search, Calendar } from 'lucide-react';

interface FeedbackSearchProps {
  onSearch: (query: string) => void;
  onDateRangeChange?: (startDate: string, endDate: string) => void;
  showDateRange?: boolean;
}

const FeedbackSearch: React.FC<FeedbackSearchProps> = ({ 
  onSearch, 
  onDateRangeChange,
  showDateRange = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const handleDateChange = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
    if (onDateRangeChange) {
      onDateRangeChange(start, end);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search feedback by customer, company, or content..."
          className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {showDateRange && (
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Start Date</span>
              </div>
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => handleDateChange(e.target.value, endDate)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>End Date</span>
              </div>
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => handleDateChange(startDate, e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
              min={startDate}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackSearch;