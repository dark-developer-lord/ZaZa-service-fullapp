import { ReactNode } from 'react'
import { PermissionGuard } from './permission-guard'
import { PermissionModules } from './modules'

interface ProtectedRouteProps {
  children: ReactNode
  permission?: PermissionModules
}

export const ProtectedRoute = ({ children, permission }: ProtectedRouteProps) => {
  return (
    <PermissionGuard requiredPermission={permission}>
      {children}
    </PermissionGuard>
  )
}
