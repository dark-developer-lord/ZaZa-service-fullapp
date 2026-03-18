import { Divider, Typography } from '@mui/material'

import { OrderFoodList, useGetOrder } from '@entities/orders'
import { Board } from '@shared/ui'

import { Total } from './total'

export const OrderFoods = () => {
  const { data } = useGetOrder()
  return (
    <Board>
      <Typography
        variant="h6"
        mb="24px"
      >
        Корзина
      </Typography>
      <Divider sx={{ mb: '24px' }} />
      <OrderFoodList list={data?.data.products} />
      <Total />
    </Board>
  )
}
