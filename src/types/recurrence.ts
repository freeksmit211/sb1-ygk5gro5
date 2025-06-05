export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly';

export interface RecurrenceOptions {
  type: RecurrenceType;
  endDate?: string; // ISO date string
  interval?: number; // Every X days/weeks/months
  weekdays?: number[]; // 0-6 for weekly recurrence
  monthDay?: number; // 1-31 for monthly recurrence
}