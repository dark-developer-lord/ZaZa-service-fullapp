import { useEffect } from 'react'
import { Box, Chip, Grid, Skeleton, Typography } from '@mui/material'

import {
  CategoriesSelect,
  FoodSearch,
  RestaurantSelect,
  useCartStore,
} from '@features/pos-terminal'
import { useGetWarehouseCategories } from '@entities/category'
import { useGetOrder } from '@entities/orders'
import { Board } from '@shared/ui'

export const Ui = () => {
  const { data: order } = useGetOrder()
  const [
    restaurantId,
    categoryIds,
    setRestaurantId,
    setCategoryIds,
  ] = useCartStore((state) => [
    state.restaurantId,
    state.categories,
    state.setRestaurantId,
    state.setMainRestaurantId,
    state.setZoneId,
    state.setCategories,
  ])
  const { data: categories } = useGetWarehouseCategories(restaurantId)


  useEffect(() => {
    if (order) {
      setRestaurantId(order.data.warehouse.id)
      // setMainRestaurantId(
      //   order.data.main_restaurant?.id || order.data.restaurant.id,
      // )
      // setZoneId(order.data.zone_id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order])

  return (
    <Board sx={{ minHeight: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: '24px',
        }}
      >
        <Typography
          variant="h6"
          fontWeight={600}
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          Заказ №
          {order ? (
            order.data.id
          ) : (
            <Skeleton
              variant="text"
              width={120}
              height={32}
              sx={{ ml: '8px' }}
            />
          )}
        </Typography>
      </Box>
      <Grid
        container
        spacing="24px"
      >
        <Grid
          item
          xs={6}
        >
          <RestaurantSelect />
        </Grid>
        <Grid
          item
          xs={6}
        >
          <CategoriesSelect />
        </Grid>
        <Grid
          item
          xs={12}
        >
          <FoodSearch />
        </Grid>
        <Grid
          item
          xs={12}
          sx={{ mt: '-12px' }}
        >
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1.5 }}>
            {categories?.data
              .filter((category) => categoryIds.includes(category.id))
              .map(({ id, name }) => (
                <Chip
                  key={id}
                  label={name}
                  sx={{ bgcolor: 'grey.100' }}
                  onDelete={() => {
                    const newCategories = categoryIds.filter(
                      (value) => value !== Number(id),
                    )
                    setCategoryIds(newCategories as any)
                  }}
                />
              ))}
          </Box>
        </Grid>
      </Grid>
    </Board>
  )
}
