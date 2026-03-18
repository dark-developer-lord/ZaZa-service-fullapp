import { Outlet, useRoutes } from 'react-router-dom'
import { AxiosError } from 'axios'

import { routes } from '@app/config/routes'
import { NetworkError } from '@widgets/network-error'
import { filterRoutes, useGetPermissions } from '@shared/auth'
import { PageLoader } from '@shared/ui'
import { useMetaPixel } from '@shared/lib'

export const RouterProvider = () => {
  const { data: permissions, isFetching, error } = useGetPermissions()
  useMetaPixel()
  const router = useRoutes([
    {
      element: <Outlet />,
      children: permissions
        ? filterRoutes(permissions, routes)
        : routes.slice(0, 5),
    },
  ])

  if (isFetching) {
    return <PageLoader />
  }

  if (error instanceof AxiosError && error.code === 'ERR_NETWORK') {
    return <NetworkError />
  }

  return router
}
