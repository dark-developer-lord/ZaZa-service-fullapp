import { Fragment } from 'react'
import { Divider, Stack } from '@mui/material'

import { generateArray } from '@shared/lib'

import { OrderFood } from '../../model/order-show-types'
import { OrderFoodCard } from './order-food-card'
import { OrderFoodCardSkeleton } from './order-food-card-skeleton'

interface Props {
  list?: OrderFood[]
}

export const OrderFoodList = ({ list }: Props) => {
  if (!list) {
    return (
      <Stack spacing="24px">
        {generateArray(3).map((index) => (
          <Fragment key={index}>
            <OrderFoodCardSkeleton />
            {index !== 3 && <Divider sx={{ mt: '24px' }} />}
          </Fragment>
        ))}
      </Stack>
    )
  }

  return (
    <Stack spacing="24px">
      {list.map((food, index) => (
        <Fragment key={food.id}>
          <OrderFoodCard
            key={food.id}
            food={food}
          />
          {index !== list.length - 1 && <Divider sx={{ mt: '24px' }} />}
        </Fragment>
      ))}
    </Stack>
  )
}
