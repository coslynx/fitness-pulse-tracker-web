/**
 * @fileoverview Utility functions for the TrackFitnessGoals application.
 */

/**
 * Formats a date string into a specified format.
 * @param {string} dateString - The date string to format (e.g., '2024-03-15T10:00:00Z').
 * @param {string} [format='YYYY-MM-DD'] - The format string (e.g., 'YYYY-MM-DD', 'MM/DD/YYYY', 'MMM DD, YYYY').
 * @returns {string} The formatted date string, or an empty string if the date is invalid.
 */
const formatDate = (dateString, format = 'YYYY-MM-DD') => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return ''; // Return empty string for invalid date
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const monthName = date.toLocaleString('default', { month: 'short' });


    switch (format) {
      case 'YYYY-MM-DD':
        return `${year}-${month}-${day}`;
      case 'MM/DD/YYYY':
        return `${month}/${day}/${year}`;
      case 'MMM DD, YYYY':
          return `${monthName} ${day}, ${year}`;
      default:
        return `${year}-${month}-${day}`; // Default to YYYY-MM-DD if format is invalid
    }
  } catch (error) {
    console.error('Error formatting date:', error);
    return ''; // Return empty string if any error occurs
  }
};


/**
 * Sanitizes a string input to prevent basic XSS attacks.
 * Replaces <, >, &, ', and " with their corresponding HTML entities.
 * @param {string} input - The string to sanitize.
 * @returns {string} The sanitized string, or an empty string if input is not a string.
 */
const sanitizeInput = (input) => {
    if (typeof input !== 'string') {
        return ''; // Return empty string if not a string
    }

    return input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/'/g, '&#39;')
        .replace(/"/g, '&quot;');
};


/**
 * Validates if an email string is in a valid format.
 * @param {string} email - The email string to validate.
 * @returns {boolean} True if the email is valid, false otherwise.
 */
const validateEmail = (email) => {
    if (typeof email !== 'string') {
        return false; // Return false if not a string
    }

    // Regular expression for email validation, covering standard patterns
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    return emailRegex.test(email); // Test if email matches regex, returns true or false
};

/**
 * Generates a unique string ID.
 * Uses crypto.randomUUID() if available, or falls back to Date.now().
 * @returns {string} A unique string ID.
 */
const generateUniqueId = () => {
  try {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID(); // Use crypto.randomUUID() if available
    } else {
         console.log('crypto.randomUUID is not available, using Date.now() fallback for ID generation');
         return Date.now().toString(); // Fallback to Date.now() if crypto is not available
    }
  } catch (error) {
     console.error('Error generating unique ID:', error);
    return Date.now().toString(); // Fallback to Date.now() if any error occurs
  }
};


export { formatDate, sanitizeInput, validateEmail, generateUniqueId };
