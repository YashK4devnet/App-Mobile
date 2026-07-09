/**
 * Date formatting utilities for the Audit App
 */

/**
 * Returns the current date formatted for an HTML <input type="date">
 * Format: YYYY-MM-DD (Local Time)
 */
export const getCurrentDateForInput = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now - offset).toISOString().split('T')[0];
};

/**
 * Returns the current date and time formatted for an HTML <input type="datetime-local">
 * Format: YYYY-MM-DDTHH:mm (Local Time)
 */
export const getCurrentDateTimeForInput = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now - offset).toISOString().slice(0, 16);
};

/**
 * Formats a given date object or string into a display-friendly format
 * Example: "09 Jul 2026, 12:00 PM"
 */
export const formatForDisplay = (dateValue) => {
  if (!dateValue) return '';
  try {
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return dateValue; // fallback if invalid
    
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (e) {
    return dateValue;
  }
};

/**
 * Converts any local date string/object into Odoo's expected strict UTC format
 * Format: YYYY-MM-DD HH:mm:ss (UTC)
 */
export const formatForOdoo = (dateValue) => {
  if (!dateValue) return false;
  try {
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return false;
    
    // Odoo expects UTC time, formatted exactly as YYYY-MM-DD HH:mm:ss
    return date.toISOString().replace('T', ' ').substring(0, 19);
  } catch (e) {
    return false;
  }
};
