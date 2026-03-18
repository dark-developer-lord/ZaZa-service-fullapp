import { Grid } from '@mui/material'

import { generateArray } from '@shared/lib'

import { CardSkeleton } from './card-skeleton'

export const ListSkeleton = () => {
  return (
    <Grid
      container
      spacing={2}
    >
      {generateArray(4).map((index) => (
        <Grid
          key={index}
          item
          xs={3}
        >
          <CardSkeleton />
        </Grid>
      ))}
    </Grid>
  )
}
