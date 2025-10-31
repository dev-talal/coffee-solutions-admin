/**
 * Format JavaScript Date to MySQL datetime format (YYYY-MM-DD HH:MM:SS)
 */
export const formatDateToMySQL = (date: Date | string | undefined): string => {
  if (!date) return '';

  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

/**
 * Parse MySQL datetime string to JavaScript Date object
 */
export const parseMySQLDate = (mysqlDate: string | undefined): Date | undefined => {
  if (!mysqlDate) return undefined;
  return new Date(mysqlDate);
};
