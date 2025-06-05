import { RecurrenceOptions } from '../types/recurrence';

export const generateRecurringDates = (
  startDate: Date,
  options: RecurrenceOptions
): Date[] => {
  if (options.type === 'none') return [startDate];

  const dates: Date[] = [];
  const endDate = options.endDate ? new Date(options.endDate) : null;
  const interval = options.interval || 1;

  let currentDate = new Date(startDate);
  
  while (!endDate || currentDate <= endDate) {
    dates.push(new Date(currentDate));

    switch (options.type) {
      case 'daily':
        currentDate = new Date(currentDate.setDate(currentDate.getDate() + interval));
        break;
      
      case 'weekly':
        if (options.weekdays && options.weekdays.length > 0) {
          // Find next weekday in the list
          let found = false;
          let tempDate = new Date(currentDate);
          tempDate.setDate(tempDate.getDate() + 1);
          
          while (!found) {
            if (options.weekdays.includes(tempDate.getDay())) {
              currentDate = tempDate;
              found = true;
            } else {
              tempDate.setDate(tempDate.getDate() + 1);
            }
          }
        } else {
          currentDate = new Date(currentDate.setDate(currentDate.getDate() + (7 * interval)));
        }
        break;
      
      case 'monthly':
        if (options.monthDay) {
          // Set to specified day of next month
          currentDate.setMonth(currentDate.getMonth() + interval);
          currentDate.setDate(Math.min(options.monthDay, getDaysInMonth(currentDate)));
        } else {
          currentDate = new Date(currentDate.setMonth(currentDate.getMonth() + interval));
        }
        break;
      
      default:
        return dates;
    }

    // Break if we've generated too many dates (safety check)
    if (dates.length > 365) break;
  }

  return dates;
};

const getDaysInMonth = (date: Date): number => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};