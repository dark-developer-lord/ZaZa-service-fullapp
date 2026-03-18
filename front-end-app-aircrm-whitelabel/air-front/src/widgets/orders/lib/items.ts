export type FilterKeys = 'all_time' | 'month' | 'week' | 'today' | 'none'

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
  {
    key: 'none',
    title: 'Не выбрано',
  },
] as const
