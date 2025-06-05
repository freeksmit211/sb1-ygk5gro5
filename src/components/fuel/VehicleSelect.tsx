import React from 'react';

interface VehicleSelectProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

const VEHICLES = [
  'HXJ 207 MP',
  'JDT 129 MP',
  'JTC 430 MP',
  'JTC 437 MP',
  'JXZ 199 MP',
  'KPJ 902 MP',
  'KPN 084 MP',
  'KPN 089 MP',
  'KRM 836 MP',
  'KRP 201 MP',
  'KWR 435 MP',
  'KZJ 664 MP',
  'KZW 922 MP'
];

const VehicleSelect: React.FC<VehicleSelectProps> = ({
  value,
  onChange,
  required = true
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">Vehicle</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
        required={required}
      >
        <option value="">Select a vehicle</option>
        {VEHICLES.map(vehicle => (
          <option key={vehicle} value={vehicle}>
            {vehicle}
          </option>
        ))}
      </select>
    </div>
  );
};

export default VehicleSelect;