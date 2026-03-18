import { lazy } from 'react'

export const PageLazy = lazy(() =>
  import('./page').then(({ Page }) => ({ default: Page })),
)
