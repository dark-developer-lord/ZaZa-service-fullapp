import { QueryClient } from 'react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Serve cached data for 30 s before considering it stale.
      // Overridden per-query where fresher data is needed (e.g. orders, messenger).
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
})
