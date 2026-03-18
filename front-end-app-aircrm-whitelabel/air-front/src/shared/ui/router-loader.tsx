import { PropsWithChildren, ReactNode, Suspense } from 'react'

import { PageLoader } from './page-loader'

interface Props extends PropsWithChildren {
  loader?: ReactNode
}

export const RouterLoader = ({ loader, children }: Props) => {
  return <Suspense fallback={loader ?? <PageLoader />}>{children}</Suspense>
}
