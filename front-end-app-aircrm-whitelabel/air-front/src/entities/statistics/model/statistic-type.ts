export interface Statistics {
  [key: string]: number
}

export interface ChartStatistic<T = string | number | Date> {
  month: T
  total: T

  [key: string]: T
}
