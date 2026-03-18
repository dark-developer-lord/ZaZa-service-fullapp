import { DateRange } from '@mui/x-date-pickers-pro'
import dayjs, { Dayjs } from 'dayjs'

export const calcDay = (before: number): DateRange<Dayjs> => {
  const currentDate: Dayjs = dayjs()

  const pastDate: Dayjs = currentDate.subtract(before, 'day')

  return [pastDate, currentDate]
}
