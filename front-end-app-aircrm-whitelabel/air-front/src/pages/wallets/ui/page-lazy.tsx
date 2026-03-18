import { lazy } from 'react'

export const PageLazy = lazy(() => import('./page').then(module => ({ default: module.Page })))
