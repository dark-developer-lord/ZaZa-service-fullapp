import { Fragment } from 'react'
import { useQuery } from 'react-query'
import { Box, Divider, List, ListItem, Typography } from '@mui/material'

import { ApiKeys, getApiPaths, getQuery } from '@shared/api'

import { LastOrderType } from '../model/last-order-type'
import { LastOrderCard } from './last-order-card'
import { LastOrderListSkeleton } from './last-order-list-skeleton'

export const LastOrderList = () => {
  const { data, isFetching, error } = useQuery({
    queryKey: [ApiKeys.Common.lastOrders],
    queryFn: getQuery<LastOrderType[]>(getApiPaths().lastOrders),
  })

  if (isFetching || !data) {
    return <LastOrderListSkeleton />
  }

  if (error) {
    console.error(error)
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100%"
        pb={4}
      >
        <Typography variant="h6">Произошла ошибка при загрузки</Typography>
      </Box>
    )
  }

  return (
    <List>
      {data!.map((order, index) => (
        <Fragment key={order.id}>
          <ListItem sx={{ paddingX: 0 }}>
            <LastOrderCard order={order} />
          </ListItem>
          {index !== data!.length - 1 && <Divider component="li" />}
        </Fragment>
      ))}
    </List>
  )
}
