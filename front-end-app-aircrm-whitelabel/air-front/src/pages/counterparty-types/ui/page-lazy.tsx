import { lazy } from 'react'

export const CounterpartyTypesPage = lazy(() => import('./page').then(module => ({ default: module.Page })))

