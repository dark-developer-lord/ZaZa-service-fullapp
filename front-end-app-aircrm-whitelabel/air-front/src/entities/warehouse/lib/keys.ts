import { palette } from '@shared/theme/palette'
import { alpha } from '@mui/material'
import { purple } from '@mui/material/colors';

export type Keys = 'goods' | 'receipt' | 'sales' | 'flow' | 'incoming' | 'inventory' | 'write-off'

type ObjectType = Record<Keys, string>

export const icons: ObjectType = {
  goods: '/icons/db.svg',
  receipt: '/icons/db.svg',
  sales: '/icons/db.svg',
  flow: '/icons/db.svg',
  incoming: '/icons/db.svg',
  inventory: '/icons/db.svg',
  ['write-off']: '/icons/db.svg',
}

export const texts: ObjectType = {
  goods: 'Товары',
  receipt: 'Приход',
  sales: 'Реализация',
  flow : 'Перемещение',
  incoming: 'Входящие',
  inventory: 'Инвентаризация',
  ['write-off']: 'Списание'
}

export const colors: ObjectType = {
  goods: purple[500],
  receipt: '#0E9F6E',
  sales: palette.info.main,
  flow: palette.success.main,
  incoming: palette.warning.main,
  inventory: palette.error.main,
  ['write-off']: palette.error.main,
}

export const backgrounds: Partial<Record<Keys, string>> = {
  inventory: alpha(palette.error.main, 0.08),
}
