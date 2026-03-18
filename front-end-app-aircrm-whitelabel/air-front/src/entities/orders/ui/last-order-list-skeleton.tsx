import { Fragment } from 'react'
import { Divider, List, ListItem } from '@mui/material'

import { generateArray } from '@shared/lib'

import { LastOrderCardSkeleton } from './last-order-card-skeleton'

export const LastOrderListSkeleton = () => {
  return (
    <List>
      {generateArray(4).map((index) => (
        <Fragment key={index}>
          <ListItem sx={{ paddingX: 0 }}>
            <LastOrderCardSkeleton />
          </ListItem>
          {index !== 3 && <Divider component="li" />}
        </Fragment>
      ))}
    </List>
  )
}
