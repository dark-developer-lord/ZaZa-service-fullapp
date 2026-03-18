import { useEffect, useState } from 'react'
import { Pagination, Typography } from '@mui/material'

import { AddToCart, useCartStore } from '@features/pos-terminal'
import { FoodList, useGetFoods } from '@entities/products'
import { ApiKeys, queryClient } from '@shared/api'
import { Board } from '@shared/ui'

export const Ui = () => {
  const [page, setPage] = useState(1)
  const [restaurantId, mainRestaurantId, zoneId, searchValue, categories] =
    useCartStore((state) => [
      state.restaurantId,
      state.mainRestaurantId,
      state.zoneId,
      state.search,
      state.categories,
    ])
  const { data, isFetching } = useGetFoods({
    search: searchValue,
    warehouseId: restaurantId,
    categories,
    page,
    perPage: 16,
  })

  useEffect(() => {
    setPage(1)
  }, [searchValue, mainRestaurantId, restaurantId, zoneId, categories])

  useEffect(() => {
    if (!mainRestaurantId || !restaurantId || !zoneId) {
      queryClient.resetQueries({ queryKey: [ApiKeys.Common.restaurantFoods] })
    }
  }, [restaurantId, mainRestaurantId, zoneId])

  return (
    <Board sx={{ minHeight: {xs: '150px', mobile: '500px'}, position: 'relative' }}>
      {data && data.data.length > 0 && (
        <Typography
          variant="h6"
          mb="24px"
        >
          Выбрать товары
        </Typography>
      )}
      { !isFetching && data === undefined &&
        <>
          <Typography
            variant="h6"
            mb={1}
            textAlign='center'
          >
            Товаров нет
          </Typography>
          <Typography
            variant="body1"
            textAlign='center'
          >
            (выберите склад)
          </Typography>
        </>
      }
      <FoodList
        foods={data}
        isFetching={isFetching}
        AddToCartButton={AddToCart}
      />
      {data && data.meta && data.meta.last_page !== 1 && (
        <Pagination
          count={data.meta.last_page}
          page={data.meta.current_page}
          onChange={(_, page) => {
            setPage(page)
          }}
          sx={{
            marginTop: '24px',
            display: 'flex',
            justifyContent: 'center',
          }}
        />
      )}
    </Board>
  )
}
