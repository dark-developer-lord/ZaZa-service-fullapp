import { useQuery } from 'react-query'
import { Box, List, ListItem, Typography } from '@mui/material'

import { Api, ApiKeys, getQuery } from '@shared/api'

import { TopFood } from '../model/top-food'
import { TopFoodCard } from './top-food-card'
import { TopFoodListSkeleton } from './top-food-list-skeleton'

export const TopFoodList = () => {
  const { data, isFetching, error } = useQuery({
    queryKey: [ApiKeys.Common.topFoods],
    queryFn: getQuery<TopFood[]>(Api.topFoods),
  })

  if (isFetching || !data) {
    return <TopFoodListSkeleton />
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
        <Typography variant="h6">Произошла ошибка при загрузке</Typography>
      </Box>
    )
  }

  return (
    <List>
      {data!.map((food) => (
        <ListItem
          key={food.id}
          sx={{ paddingX: 0 }}
        >
          <TopFoodCard food={food} />
        </ListItem>
      ))}
    </List>
  )
}
