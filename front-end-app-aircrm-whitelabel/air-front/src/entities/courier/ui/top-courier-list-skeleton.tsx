import { Fragment } from 'react'
import { List, ListItem } from '@mui/material'

import { generateArray } from '@shared/lib'

import { TopCourierCardSkeleton } from './top-courier-card-skeleton'

export const TopCourierListSkeleton = () => {
  return (
    <List>
      {generateArray(3).map((index) => (
        <Fragment key={index}>
          <ListItem sx={{ paddingX: 0 }}>
            <TopCourierCardSkeleton />
          </ListItem>
        </Fragment>
      ))}
    </List>
  )
}
