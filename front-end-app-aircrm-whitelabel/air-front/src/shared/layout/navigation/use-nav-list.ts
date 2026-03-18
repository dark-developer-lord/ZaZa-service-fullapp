import { useEffect, useState } from 'react'

import { OrderStatus, OrderStatusType, useOrdersCounts } from '@shared/lib'

import { useGetPermissions } from '../../auth'
import { filterNavList } from '../../auth/permissions/filter-nav-list'
import { NavGroupType } from './nav-type'

export const useNavList = (navigation: NavGroupType[]) => {
  const [navList, setNavList] = useState<NavGroupType[]>(navigation)
  // A counter that increments each time panel preferences change —
  // including it in the dependency array forces a re-filter with the
  // latest localStorage data, without a full page reload.
  const [panelVersion, setPanelVersion] = useState(0)
  const { data } = useOrdersCounts()
  const { data: permissions } = useGetPermissions()

  useEffect(() => {
    const handler = () => setPanelVersion((v) => v + 1)
    window.addEventListener('panel-settings-changed', handler)
    return () => window.removeEventListener('panel-settings-changed', handler)
  }, [])

  useEffect(() => {
    if (permissions) {
      let filteredNavList = filterNavList(permissions, navigation)
      if (data) {
        filteredNavList = setOrderStatistics(filteredNavList, data)
      }
      setNavList(filteredNavList)
    }
  // panelVersion forces re-evaluation when the user saves panel preferences
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, navigation, permissions, panelVersion])

  return navList
}

const setOrderStatistics = (
  navigation: NavGroupType[],
  data: Record<OrderStatus, number>,
) => {
  const list = [...navigation]
  const orders = list.find((group) => group.id === 'orders')
  const ordersItem = orders?.children.find((item) => item.name === 'orders')
  if (ordersItem) {
    ordersItem.children?.forEach((child) => {
      child.chip = data[child.name as OrderStatusType]
    })
    return list
  }

  return navigation
}
