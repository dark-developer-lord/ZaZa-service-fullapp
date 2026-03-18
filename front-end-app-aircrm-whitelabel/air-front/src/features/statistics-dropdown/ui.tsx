import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'

import { FilterKeys, items } from './lib/items'
import { useStore } from './model/store'

export const Ui = () => {
  const { activeKey, setActiveId } = useStore()

  return (
    <FormControl>
      <InputLabel id="statistics-filter">Показать</InputLabel>
      <Select
        label="Показать"
        value={activeKey}
        onChange={(event) => {
          setActiveId(event.target.value as FilterKeys)
        }}
        sx={{ width: 220 }}
        size="medium"
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
  )
}
