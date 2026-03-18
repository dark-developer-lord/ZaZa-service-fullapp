import { DateRange } from '@mui/x-date-pickers-pro'
import { Dayjs } from 'dayjs'

import { OrderStatus, formatDateForAPI } from '@shared/lib'

import { FilterKeys } from '../lib/items'

export interface FilterDto {
  restaurantId: number | null
  date: DateRange<Dayjs>
  duration: FilterKeys
  status: string[]
}

export const dtoToQueryExport = (filter: FilterDto) => {
  const query = new URLSearchParams()
  if (filter.restaurantId) {
    query.append('restaurant_ids[]', filter.restaurantId.toString())
  }
  if (filter.date[0] && filter.date[1]) {
    query.append(
      'from_date',
      formatDateForAPI(filter.date[0] as Dayjs),
    )
    query.append(
      'to_date',
      formatDateForAPI(filter.date[1] as Dayjs),
    )
  } else {
    query.append('duration', 'all_time')
  }

  if (
    filter.status.length > 0 &&
    filter.status.length !== Object.keys(OrderStatus).length
  ) {
    filter.status.forEach((status) => {
      query.append('status[]', status)
    })
  }
  return query
}
