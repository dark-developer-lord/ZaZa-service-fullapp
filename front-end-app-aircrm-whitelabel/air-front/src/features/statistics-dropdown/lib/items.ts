export type FilterKeys = 'all_time' | 'month' | 'week' | 'today'

export const items: { key: FilterKeys; title: string }[] = [
  {
    key: 'today',
    title: 'За день',
  },
  {
    key: 'week',
    title: 'За неделю',
  },
  {
    key: 'month',
    title: 'За месяц',
  },
  {
    key: 'all_time',
    title: 'За все время',
  },
] as const
