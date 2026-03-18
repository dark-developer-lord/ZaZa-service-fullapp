import { Typography } from '@mui/material'

import { TopRestaurantList } from '@entities/warehouses'
import { Board } from '@shared/ui'

export const Ui = () => {
  return (
    <Board sx={{ height: '100%' }}>
      <Typography
        variant="h5"
        component="h2"
      >
        Топ ресторанов
      </Typography>
      <TopRestaurantList />
    </Board>
  )
}
