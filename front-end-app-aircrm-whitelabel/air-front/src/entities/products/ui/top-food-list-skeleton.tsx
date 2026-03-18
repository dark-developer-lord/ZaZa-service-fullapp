import { Fragment } from 'react'
import { List, ListItem } from '@mui/material'

import { generateArray } from '@shared/lib'

import { TopFoodCardSkeleton } from './top-food-card-skeleton'

export const TopFoodListSkeleton = () => {
  return (
    <List>
      {generateArray(3).map((index) => (
        <Fragment key={index}>
          <ListItem sx={{ paddingX: 0 }}>
            <TopFoodCardSkeleton />
          </ListItem>
        </Fragment>
      ))}
    </List>
  )
}
