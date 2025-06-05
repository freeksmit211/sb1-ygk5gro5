import React from 'react';

interface YearSelectProps {
  value: number;
  onChange: (year: number) => void;
}

const YearSelect: React.FC<YearSelectProps> = ({ value, onChange }) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear + i - 2);

  return (
    <select
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value))}
      className="px-4 py-2 rounded-lg border bg-white text-gray-700 font-medium"
    >
      {years.map(year => (
        <option key={year} value={year}>{year}</option>
      ))}
    </select>
  );
};

export default YearSelect;