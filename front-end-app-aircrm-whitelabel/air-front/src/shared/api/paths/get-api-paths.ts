import { getLSLoginSource } from '../../auth'
import { Api } from './index'
import { VendorApi } from './vendor'

export const getApiPaths = (loginSource = getLSLoginSource()) => {
  if (loginSource === 'admin') {
    return Api
  }
  // Both vendor and vendor-employee use VendorApi paths
  return VendorApi
}
