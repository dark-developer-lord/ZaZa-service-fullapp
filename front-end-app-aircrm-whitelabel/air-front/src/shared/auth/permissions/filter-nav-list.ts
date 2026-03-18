import { NavGroupType, NavType } from '../../layout'
import { getEnabledPanels } from '../vendor-panels'
import { getLSLoginSource } from '../storage-token'
import { PermissionModules } from './modules'

export const filterNavList = (
  permissions: PermissionModules[] | string,
  navList: NavGroupType[],
): NavGroupType[] => {
  const list: NavGroupType[] = []
  const loginSource = getLSLoginSource()!
  const routeSource: 'vendor' | 'vendor-employee' | 'admin' =
    loginSource === 'admin'
      ? 'admin'
      : loginSource === 'vendor-employee'
        ? 'vendor-employee'
        : 'vendor'

  // Vendor panel preferences — only for vendor / vendor-employee; null = all visible
  const enabledPanels =
    routeSource === 'admin' ? null : getEnabledPanels()

  navList.forEach((nav) => {
    // Skip groups the vendor has hidden in panel settings
    if (enabledPanels !== null && nav.id && !enabledPanels.includes(nav.id)) {
      return
    }

    const group: NavGroupType = { ...nav, children: [] }
    nav.children.forEach((child) => {
      const subMenu: NavType = { ...child, children: [] }
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
        group.children.push(subMenu)
      }
    })

    if (group.children.length > 0) {
      list.push(group)
    }
  })
  return list
}

