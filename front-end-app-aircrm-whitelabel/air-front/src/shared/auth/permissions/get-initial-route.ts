import { RouterPaths } from '../../lib'
import { useHasPermission } from './has-permission'
import { PermissionModules } from './modules'

export const useGetInitialRoute = () => {
  const hasPermission = useHasPermission()
  if (hasPermission(PermissionModules.dashboard)) {
    return RouterPaths.posTerminal
  }
  if (hasPermission(PermissionModules.posTerminal)) {
    return RouterPaths.posTerminal
  }
  if (hasPermission(PermissionModules.order)) {
    return RouterPaths.orders
  }
  if (hasPermission(PermissionModules.food)) {
    return RouterPaths.foods
  }
  if (hasPermission(PermissionModules.category)) {
    return RouterPaths.categories
  }
  if (hasPermission(PermissionModules.deliveryman)) {
    return RouterPaths.couriers
  }
  if (hasPermission(PermissionModules.restaurant)) {
    return RouterPaths.restaurants
  }
  if (hasPermission(PermissionModules.zone)) {
    return RouterPaths.zones
  }
  if (hasPermission(PermissionModules.banner)) {
    return RouterPaths.banners
  }
  if (hasPermission(PermissionModules.campaign)) {
    return RouterPaths.campaigns
  }
  if (hasPermission(PermissionModules.customer)) {
    return RouterPaths.customers
  }
  if (hasPermission(PermissionModules.admin)) {
    return RouterPaths.admins
  }
}
