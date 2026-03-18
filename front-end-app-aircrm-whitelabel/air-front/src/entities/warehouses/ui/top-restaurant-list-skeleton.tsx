import { Fragment } from 'react'
import { List, ListItem } from '@mui/material'

import { generateArray } from '@shared/lib'

import { TopRestaurantCardSkeleton } from './top-restaurant-card-skeleton'

export const TopRestaurantListSkeleton = () => {
  return (
    <List>
      {generateArray(3).map((index) => (
        <Fragment key={index}>
          <ListItem sx={{ paddingX: 0 }}>
            <TopRestaurantCardSkeleton />
          </ListItem>
        </Fragment>
      ))}
    </List>
  )
}
