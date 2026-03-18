import { FC } from 'react'
import { Grid, Typography } from '@mui/material'

import { DataPagination } from '@shared/api'
import { generateArray } from '@shared/lib'

import { Food } from '../../finance/model/food'
import { Card } from './card'
import { CardSkeleton } from './card-skeleton'

interface Props {
  foods?: DataPagination<Food>
  isFetching: boolean
  AddToCartButton?: FC<{ food: Food }>
}

export const List = ({ foods, AddToCartButton, isFetching }: Props) => {
  if (foods?.data.length === 0) {
    return (
      <Typography
        variant="h4"
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        Продукты не найдены
      </Typography>
    )
  }

  if (isFetching) {
    return (
      <Grid
        container
        spacing="16px"
      >
        {generateArray(16).map((id) => (
          <Grid
            key={id}
            item
            xs={6}
            mobile={3}
          >
            <CardSkeleton />
          </Grid>
        ))}
      </Grid>
    )
  }

  return (
    <Grid
      container
      spacing="16px"
    >
      {foods?.data.sort(function(a,b){return (b.quantity as number) - (a.quantity as number);}).map((food) => (
        <Grid
          key={food.id}
          item
          xs={6}
          mobile={3}
        >
        <Card
          food={food}
          ButtonComponent={AddToCartButton && <AddToCartButton food={food} />}
        />
        </Grid>
      ))}
    </Grid>
  )
}
