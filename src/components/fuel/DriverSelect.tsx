import React from 'react';

interface DriverSelectProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

const DRIVERS = [
  'Angilique',
  'Billy',
  'Chanell',
  'Cindy',
  'Daan',
  'Elize',
  'Franco',
  'Freek',
  'Izahn',
  'Jeckie',
  'Leon',
  'Matthews',
  'Petros'
];

const DriverSelect: React.FC<DriverSelectProps> = ({
  value,
  onChange,
  required = true
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">Driver</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
        required={required}
      >
        <option value="">Select a driver</option>
        {DRIVERS.map(driver => (
          <option key={driver} value={driver}>
            {driver}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DriverSelect;