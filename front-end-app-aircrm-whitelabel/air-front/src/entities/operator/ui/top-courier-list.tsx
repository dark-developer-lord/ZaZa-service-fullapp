import { useQuery } from 'react-query'
import { Box, List, ListItem, Typography } from '@mui/material'

import { Api, ApiKeys, DataPagination, getQuery } from '@shared/api'

import { TopOperator } from '../model/top-courier'
import { TopOperatorCard } from './top-courier-card'
import { TopOperatorListSkeleton } from './top-courier-list-skeleton'

interface Props {
  activeKey?: string
}

export const TopOperatorList = ({ activeKey }: Props) => {
  const { data, isFetching, error, isRefetching } = useQuery({
    queryKey: [ApiKeys.Common.TopOperators + activeKey],
    queryFn: getQuery<DataPagination<TopOperator>>(
      Api.topOperators + `${activeKey ? `?duration=${activeKey}` : ''}`,
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
    <Box>
      <List>
        {isFetching && <TopOperatorListSkeleton />}
        {data?.data.map((operator) => (
          <ListItem
            key={operator.id}
            sx={{ paddingX: 0 }}
          >
            <TopOperatorCard operator={operator} />
          </ListItem>
        ))}
        {isRefetching && <TopOperatorListSkeleton />}
      </List>
    </Box>
  )
}
