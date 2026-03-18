import { useEffect } from 'react'

/**
 * Sets document.title on mount (and when `title` changes).
 * Restores the original title on unmount.
 *
 * Usage:
 *   usePageTitle('Заказы')   // → "Заказы | Air CRM"
 */
export const usePageTitle = (title: string, suffix = 'Air CRM') => {
  useEffect(() => {
    const prev = document.title
    document.title = title ? `${title} | ${suffix}` : suffix
    return () => {
      document.title = prev
    }
  }, [title, suffix])
}
