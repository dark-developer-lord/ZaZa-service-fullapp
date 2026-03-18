import { DateRange } from '@mui/x-date-pickers-pro'
import { Dayjs } from 'dayjs'

import { OrderStatus } from '@shared/lib'

import { FilterKeys } from '../lib/items'

export interface FilterDto {
  restaurantId: number | null
  warehouseId: number | null
  date: DateRange<Dayjs>
  duration: FilterKeys
  status: string[]
  hasInstallment: boolean | null
}

export const dtoToQuery = (filter: FilterDto) => {
  const query = new URLSearchParams()

  if (filter.restaurantId) {
    query.append('store_id', filter.restaurantId.toString())
  }
  if (filter.warehouseId) {
    query.append('warehouse_id', filter.warehouseId.toString())
  }
  if (filter.date[0] && filter.date[1]) {
    query.append('from_date', (filter.date[0] as Dayjs).toISOString())
    query.append('to_date', (filter.date[1] as Dayjs).toISOString())
  }
  if (
    filter.status.length > 0 &&
    filter.status.length !== Object.keys(OrderStatus).length
  ) {
    filter.status.forEach((status) => {
      query.append('status[]', status)
    })
  }
  if (filter.hasInstallment !== null) {
    query.append('has_installment', filter.hasInstallment.toString())
  }

  return query
}
