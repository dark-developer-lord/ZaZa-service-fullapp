import { useQuery } from 'react-query'
import { Box, List, ListItem, Typography } from '@mui/material'

import { Api, ApiKeys, getQuery } from '@shared/api'

import { TopCourier } from '../model/top-courier'
import { TopCourierCard } from './top-courier-card'
import { TopCourierListSkeleton } from './top-courier-list-skeleton'

interface Props {
  activeKey?: string
}

export const TopCourierList = ({ activeKey }: Props) => {
  const { data, isFetching, error, isRefetching } = useQuery({
    queryKey: [ApiKeys.Common.topCouriers + activeKey],
    queryFn: getQuery<TopCourier[]>(
      Api.topCouriers + `${activeKey ? `?duration=${activeKey}` : ''}`,
    ),
  })

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
    <List
      sx={{
        maxHeight: 500,
        overflowY: 'auto',
        padding: 0,
      }}
    >
      {isFetching && <TopCourierListSkeleton />}
      {data?.map((courier) => (
        <ListItem
          key={courier.id}
          sx={{ paddingX: 0 }}
        >
          <TopCourierCard courier={courier} />
        </ListItem>
      ))}
      {isRefetching && <TopCourierListSkeleton />}
    </List>
  )
}
