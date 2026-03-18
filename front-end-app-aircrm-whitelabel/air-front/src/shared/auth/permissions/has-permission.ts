import { useGetPermissions } from './get-permissions'
import { PermissionModules } from './modules'

export const useHasPermission = () => {
  const { data } = useGetPermissions()

  return (permission: PermissionModules) => {
    if (data === 'full-access') {
      return true
    }
    return data?.includes(permission)
  }
}
