import { FormControl, InputLabel, MenuItem, Select, useMediaQuery, useTheme } from '@mui/material'

import { FilterKeys, items } from '@widgets/orders/lib/items'

import { useOrdersFilterStore } from '../index'
import { calcDay } from '../lib/calc-day'

export const OrdersDuration = () => {
  const { activeKey, setActiveId, changeDate, clearDate } =
    useOrdersFilterStore()

    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('mobile'))

  const changeFilterDate = (duration: FilterKeys) => {
    setActiveId(duration)
    switch (duration) {
      case 'month':
        changeDate(calcDay(30))
        break
      case 'week':
        changeDate(calcDay(7))
        break
      case 'today':
        changeDate(calcDay(0))
        break
      default:
        clearDate()
    }
  }
  return ( <>
    { !isMobile && (
      <FormControl>
      <InputLabel id="orders-filter">Показать</InputLabel>
      <Select
        label="Показать"
        value={activeKey}
        onChange={(event) => {
          changeFilterDate(event.target.value as FilterKeys)
        }}
        sx={{width: {sm: '220px'}}}
        size={"medium"}
      >
        {items.map((item) => (
          <MenuItem
            key={item.key}
            value={item.key}
          >
            {item.title}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
      )}
    </>
  )
}
