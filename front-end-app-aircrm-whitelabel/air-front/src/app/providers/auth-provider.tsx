import { PropsWithChildren, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AxiosError } from 'axios'

import { NetworkError } from '@widgets/network-error'
import { useGetProfile } from '@features/auth'
import { getToken, useGetInitialRoute, useGetPermissions } from '@shared/auth'
import { PageLoader } from '@shared/ui'

export const AuthProvider = ({ children }: PropsWithChildren) => {
  // isLoading = only true on the very first fetch (no cached data yet).
  // isFetching is also true on background refetches — using it caused the
  // PageLoader to flash over the whole app whenever react-query refetched.
  const { isLoading: isFetching, error } = useGetProfile()
  const { data: permissions } = useGetPermissions()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const initialRoute = useGetInitialRoute()

  useEffect(() => {
    const hasToken = getToken()
    const isAuthPage = pathname.startsWith('/auth/')
    const publicAuthPages = [
      '/auth/register',
      '/auth/delivery-man/login',
      '/auth/employee/login',
      '/auth/saas/login',
      '/auth/saas/register',
    ]

    if (
      (!isFetching &&
        error instanceof AxiosError &&
        error.response?.status === 401) ||
      (!hasToken && !publicAuthPages.includes(pathname))
    ) {
      navigate('/auth/login')
    } else if (
      hasToken &&
      isAuthPage &&
      !isFetching &&
      !error &&
      initialRoute
    ) {
      // Redirect logged-in users away from auth pages
      navigate(initialRoute)
    }
  }, [navigate, isFetching, error, initialRoute, permissions, pathname])

  useEffect(() => {
    if (pathname === '/' && initialRoute && permissions) {
      navigate(initialRoute)
    }
  }, [navigate, initialRoute, permissions])

  if (isFetching) {
    return <PageLoader />
  }

  if (error) {
    return <NetworkError />
  }

  return children
}
