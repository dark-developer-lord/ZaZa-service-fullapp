import { useEffect } from 'react'

/**
 * Displays the browser's native "leave page?" confirmation dialog when
 * `isDirty` is true. Prevents accidental data loss on unsaved forms.
 *
 * Usage:
 *   useBeforeUnload(formState.isDirty)
 */
export const useBeforeUnload = (isDirty: boolean) => {
  useEffect(() => {
    if (!isDirty) return

    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      // Chrome requires returnValue to be set
      e.returnValue = ''
    }

    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [isDirty])
}
