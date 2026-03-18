import { ChartStatistic } from '@entities/statistics'
import { months } from '@shared/lib'

export const transformData = (data: {
  [key: string]: string
}): ChartStatistic[] => {
  return Object.keys(data).map((key) => {
    return {
      month: months[key],
      total: Number(data[key]),
    }
  })
}
