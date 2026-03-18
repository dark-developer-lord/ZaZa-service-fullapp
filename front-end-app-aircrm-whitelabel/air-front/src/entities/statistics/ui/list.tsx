import { Grid } from '@mui/material'

import { useGetStatistics } from '../api/get-statistics'
import { colors, icons, Keys, texts } from '../lib/keys'
import { Card } from './card'
import { ListSkeleton } from './list-skeleton'

export const List = () => {
  const { data, isFetching } = useGetStatistics()

  if (isFetching || !data) {
    return <ListSkeleton />
  }
  
  return (
    <Grid
      container
      spacing={2}
    >
      {(Object.keys(data) as Keys[]).map((statistic) => (
        <Grid
          key={statistic}
          item
          xs={3}
        >
          <Card
            icon={icons[statistic]}
            color={colors[statistic]}
            link={`/orders?status=${statistic}`}
            title={texts[statistic]}
            value={`${data[statistic]} ${data[statistic] === 1 ? 'заказ' : 'заказов'}`}
          />
        </Grid>
      ))}
    </Grid>
  )
}
