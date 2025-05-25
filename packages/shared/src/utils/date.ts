import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns';

export const formatDate = (date: Date | string, pattern = 'MMM dd, yyyy'): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return isValid(dateObj) ? format(dateObj, pattern) : 'Invalid date';
};

export const formatDateTime = (date: Date | string): string => {
  return formatDate(date, 'MMM dd, yyyy HH:mm');
};

export const formatRelativeTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return isValid(dateObj) ? formatDistanceToNow(dateObj, { addSuffix: true }) : 'Invalid date';
};

export const isDateInPast = (date: Date | string): boolean => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return isValid(dateObj) && dateObj < new Date();
};

export const isDateToday = (date: Date | string): boolean => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const today = new Date();
  return isValid(dateObj) &&
    dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear();
};
