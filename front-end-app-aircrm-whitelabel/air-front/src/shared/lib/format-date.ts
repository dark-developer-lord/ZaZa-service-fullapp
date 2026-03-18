import { Dayjs } from 'dayjs'

/**
 * Format a Dayjs date to YYYY-MM-DD without timezone offset issues
 * This ensures that the selected date is preserved regardless of timezone
 * 
 * @param date - Dayjs object to format
 * @returns Date string in YYYY-MM-DD format
 * 
 * @example
 * // If user selects 10.10.2025, this will return "2025-10-10"
 * // regardless of timezone
 * formatDateForAPI(dayjs('2025-10-10'))
 */
export const formatDateForAPI = (date: Dayjs): string => {
  const year = date.year()
  const month = String(date.month() + 1).padStart(2, '0') // month() is 0-indexed
  const day = String(date.date()).padStart(2, '0')
  
  return `${year}-${month}-${day}`
}

