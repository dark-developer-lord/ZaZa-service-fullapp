import { useQuery } from 'react-query'
import { Box, List, ListItem, Typography } from '@mui/material'

import { Api, ApiKeys, getQuery } from '@shared/api'

import { TopRestaurant } from '../model/top-restaurant'
import { TopRestaurantCard } from './top-restaurant-card'
import { TopRestaurantListSkeleton } from './top-restaurant-list-skeleton'

export const TopRestaurantList = () => {
  const { data, isFetching, error } = useQuery({
    queryKey: [ApiKeys.Common.topRestaurants],
    queryFn: getQuery<TopRestaurant[]>(Api.topRestaurants),
  })

  if (isFetching || !data) {
    return <TopRestaurantListSkeleton />
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
      {data!.map((restaurant) => (
        <ListItem
          key={restaurant.id}
        >
          <TopRestaurantCard restaurant={restaurant} />
        </ListItem>
      ))}
    </List>
  )
}
