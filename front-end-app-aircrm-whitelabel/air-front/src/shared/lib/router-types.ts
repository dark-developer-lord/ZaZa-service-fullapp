import { NonIndexRouteObject } from 'react-router-dom'

import { PermissionModules } from '../auth'

export interface RouteBase extends NonIndexRouteObject {
  permission?: PermissionModules
  module?: ('vendor' | 'admin' | 'vendor-employee')[]
  children?: RouteBase[]
}
