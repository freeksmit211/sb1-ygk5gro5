import React from 'react';
import { RecurrenceOptions, RecurrenceType } from '../../types/recurrence';

interface RecurrenceSelectorProps {
  value: RecurrenceOptions;
  onChange: (options: RecurrenceOptions) => void;
  disabled?: boolean;
}

const RecurrenceSelector: React.FC<RecurrenceSelectorProps> = ({
  value,
  onChange,
  disabled = false
}) => {
  const handleTypeChange = (type: RecurrenceType) => {
    const newOptions: RecurrenceOptions = { type };
    
    if (type === 'weekly') {
      newOptions.weekdays = [new Date().getDay()];
    } else if (type === 'monthly') {
      newOptions.monthDay = new Date().getDate();
    }
    
    onChange(newOptions);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Repeat</label>
        <select
          value={value.type}
          onChange={(e) => handleTypeChange(e.target.value as RecurrenceType)}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
          disabled={disabled}
        >
          <option value="none">Don't repeat</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      {value.type !== 'none' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <input
              type="date"
              value={value.endDate || ''}
              onChange={(e) => onChange({ ...value, endDate: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
              min={new Date().toISOString().split('T')[0]}
              disabled={disabled}
            />
          </div>

          {value.type !== 'none' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Repeat every
              </label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="number"
                  value={value.interval || 1}
                  onChange={(e) => onChange({ ...value, interval: Math.max(1, parseInt(e.target.value) || 1) })}
                  className="block w-20 rounded-lg border border-gray-300 px-3 py-2"
                  min="1"
                  disabled={disabled}
                />
                <span className="text-gray-700">
                  {value.type === 'daily' && 'days'}
                  {value.type === 'weekly' && 'weeks'}
                  {value.type === 'monthly' && 'months'}
                </span>
              </div>
            </div>
          )}

          {value.type === 'weekly' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Repeat on
              </label>
              <div className="flex flex-wrap gap-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                  <label
                    key={day}
                    className="flex items-center"
                  >
                    <input
                      type="checkbox"
                      checked={value.weekdays?.includes(index) || false}
                      onChange={(e) => {
                        const weekdays = value.weekdays || [];
                        onChange({
                          ...value,
                          weekdays: e.target.checked
                            ? [...weekdays, index]
                            : weekdays.filter(d => d !== index)
                        });
                      }}
                      className="sr-only peer"
                      disabled={disabled}
                    />
                    <div className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-gray-300 peer-checked:border-blue-500 peer-checked:bg-blue-500 peer-checked:text-white cursor-pointer">
                      {day[0]}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {value.type === 'monthly' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Day of month
              </label>
              <input
                type="number"
                value={value.monthDay || 1}
                onChange={(e) => onChange({ ...value, monthDay: Math.min(31, Math.max(1, parseInt(e.target.value) || 1)) })}
                className="mt-1 block w-20 rounded-lg border border-gray-300 px-3 py-2"
                min="1"
                max="31"
                disabled={disabled}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RecurrenceSelector;