import { useEffect } from 'react'
import { Box, Button, Chip, Grid, Typography } from '@mui/material'

import {
  CartStorage,
  CategoriesSelect,
  FoodSearch,
  RestaurantSelect,
  useCartStore,
  // ZoneSelect,
} from '@features/pos-terminal'
import { useGetWarehouseCategories } from '@entities/category'
import { Board } from '@shared/ui'

export const Ui = () => {
  const [
    restaurantId,
    categoryIds,
    setRestaurantId,
    // setMainRestaurantId,
    // setZoneId,
    setCategoryIds,
    clearFilter,
  ] = useCartStore((state) => [
    state.restaurantId,
    state.categories,
    state.setRestaurantId,
    // state.setMainRestaurantId,
    // state.setZoneId,
    state.setCategories,
    state.clearFilter,
  ])
  const { data: categories } = useGetWarehouseCategories(restaurantId)

  /** Set local data to zustand store */
  useEffect(() => {
    const cartInfo = CartStorage.getNewOrderInfo
    setRestaurantId(cartInfo.restaurantId)
    // setZoneId(cartInfo.zoneId)
    // setMainRestaurantId(cartInfo.mainRestaurantId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Board sx={{ minHeight: '100%' }}>
      <Grid
        container
        spacing='16px'
        alignItems="flex-start"
      >
        <Grid
          item
          xs={12}
          mobile={6}
        >
          <Box
            sx={{
              mb: '16px',
              minHeight: '48px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Typography
              variant="h6"
              fontWeight={600}
            >
              Заполните информацию
            </Typography>
          </Box>
          <Grid container spacing='16px'>
            <Grid item xs={12} mobile={6}>
              <RestaurantSelect />
            </Grid>
            <Grid item xs={12} mobile={6}>
              <CategoriesSelect />
            </Grid>
          </Grid>
        </Grid>
        <Grid
          item
          xs={12}
          mobile={6}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: '16px',
              minHeight: '48px',
            }}
          >
            <Typography
              variant="h6"
              fontWeight={600}
            >
              Искать товар
            </Typography>
            {restaurantId !== null && (
              <Button
                color="secondary"
                size="small"
                onClick={() => {
                  clearFilter()
                }}
              >
                Очистить
              </Button>
            )}
          </Box>
          <FoodSearch />
        </Grid>
      </Grid>
      {/* Chips section - full width outside the grid */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 2 }}>
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
                setCategoryIds(newCategories)
              }}
            />
          ))}
      </Box>
    </Board>
  )
}
