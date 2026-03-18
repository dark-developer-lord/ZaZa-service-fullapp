import { Typography } from '@mui/material'

import { TopFoodList } from '@entities/products'
import { Board } from '@shared/ui'

export const Ui = () => {
  return (
    <Board sx={{ height: '100%' }}>
      <Typography
        variant="h5"
        component="h2"
      >
        Топ продуктов
      </Typography>
      <TopFoodList />
    </Board>
  )
}
