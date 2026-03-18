import type { FieldErrors } from 'react-hook-form'

/**
 * Scrolls the first field with a validation error into view so the user
 * doesn't have to hunt for it after a failed submit.
 *
 * Usage (react-hook-form):
 *   const scrollToError = useScrollToError()
 *   const onInvalid = (errors: FieldErrors<MyForm>) => scrollToError(errors)
 *   <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
 */
export const useScrollToError = () => {
  return (errors: FieldErrors) => {
    const firstKey = Object.keys(errors)[0]
    if (!firstKey) return

    // Try matching by name attribute first, then by id or aria-label
    const el =
      document.querySelector<HTMLElement>(`[name="${firstKey}"]`) ??
      document.querySelector<HTMLElement>(`#${firstKey}`) ??
      document.querySelector<HTMLElement>(`[aria-label="${firstKey}"]`)

    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      el.focus({ preventScroll: true })
    }
  }
}
