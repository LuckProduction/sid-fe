/**
 * Formats a time string into 'HH-mm' format.
 * @param {string} timeString - The time string to format.
 * @returns {string} The formatted time string in 'HH-mm' format.
 * @throws {Error} If the provided timeString is invalid.
 */
export default function timeFormatter(timeString) {
  if (!timeString) {
    return '';
  }

  const time = new Date(timeString);
  if (isNaN(time.getTime())) {
    throw new Error('Invalid time string');
  }

  const hours = String(time.getHours()).padStart(2, '0');
  const minutes = String(time.getMinutes()).padStart(2, '0');
  return `${hours}-${minutes}`;
}
