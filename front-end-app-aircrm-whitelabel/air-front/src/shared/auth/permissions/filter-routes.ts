import { RouteBase } from '../../lib'
import { getLSLoginSource } from '../storage-token'
import { PermissionModules } from './modules'

export const filterRoutes = (
  permissions: PermissionModules[] | string,
  routes: RouteBase[],
): RouteBase[] => {
  const list: RouteBase[] = []
  const loginSource = getLSLoginSource()!
  const routeSource: 'vendor' | 'vendor-employee' | 'admin' =
    loginSource === 'admin'
      ? 'admin'
      : loginSource === 'vendor-employee'
        ? 'vendor-employee'
        : 'vendor'

  routes.forEach((route) => {
    const group: RouteBase = { ...route, children: [] }
    route.children?.forEach((child) => {
      const subMenu: RouteBase = { ...child, children: [] }
      child.children?.forEach((subChild) => {
        if (
          (!subChild.module || subChild.module.includes(routeSource)) &&
          (typeof permissions === 'string' ||
            !subChild.permission ||
            permissions.includes(subChild.permission))
        ) {
          subMenu.children?.push(subChild)
        }
      })
      if (
        (!child.module || child.module.includes(routeSource)) &&
        (typeof permissions === 'string' ||
          !child.permission ||
          permissions.includes(child.permission))
      ) {
        group.children?.push(subMenu)
      }
    })

    if (
      (group.children && group.children.length > 0) ||
      !route.permission ||
      permissions === 'full-access' ||
      permissions.includes(route.permission)
    ) {
      list.push(group)
    }
  })
  return list
}
