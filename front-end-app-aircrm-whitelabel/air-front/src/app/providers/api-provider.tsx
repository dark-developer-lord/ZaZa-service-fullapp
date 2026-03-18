import { PropsWithChildren } from 'react'
import { QueryClientProvider } from 'react-query'

import { queryClient } from '@shared/api'

export const ApiProvider = ({ children }: PropsWithChildren) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
