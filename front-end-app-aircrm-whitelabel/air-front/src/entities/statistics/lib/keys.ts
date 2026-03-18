import { palette } from '@shared/theme/palette'

export type Keys = 'pending' | 'picked_up' | 'delivered' | 'canceled'

type ObjectType = Record<Keys, string>

export const icons: ObjectType = {
  pending: '/icons/db.svg',
  picked_up: '/icons/db.svg',
  delivered: '/icons/db.svg',
  canceled: '/icons/db.svg',
}

export const texts: ObjectType = {
  pending: 'На утверждении',
  picked_up: 'На доставке',
  delivered: 'Доставленно',
  canceled: 'Отменено',
}

export const colors: ObjectType = {
  pending: palette.primary.main,
  picked_up: palette.info.main,
  delivered: palette.success.main,
  canceled: palette.error.main,
}
