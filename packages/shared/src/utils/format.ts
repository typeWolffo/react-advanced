export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const truncate = (str: string, length: number): string => {
  return str.length > length ? `${str.slice(0, length)}...` : str;
};

export const slugify = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const formatPriority = (priority: string): string => {
  const priorityMap = {
    LOW: 'Low Priority',
    MEDIUM: 'Medium Priority',
    HIGH: 'High Priority',
  };
  return priorityMap[priority as keyof typeof priorityMap] || priority;
};

export const getPriorityColor = (priority: string): string => {
  const colorMap = {
    LOW: 'text-green-600',
    MEDIUM: 'text-yellow-600',
    HIGH: 'text-red-600',
  };
  return colorMap[priority as keyof typeof colorMap] || 'text-gray-600';
};

export const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};
