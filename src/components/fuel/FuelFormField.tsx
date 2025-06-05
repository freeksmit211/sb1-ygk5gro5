import React from 'react';

interface FuelFormFieldProps {
  label: string;
  type?: 'text' | 'number';
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  step?: string;
  disabled?: boolean;
}

const FuelFormField: React.FC<FuelFormFieldProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  required = true,
  step,
  disabled = false
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 ${
          disabled ? 'bg-gray-100' : ''
        }`}
        required={required}
        step={step}
        disabled={disabled}
      />
    </div>
  );
};

export default FuelFormField;