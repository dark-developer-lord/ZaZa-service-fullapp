import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
} from '@mui/material'

import { useGetWarehouses } from '@entities/warehouses'

import { useCartStore } from '../model/cart-store'

export const RestaurantSelect = () => {
  const [value, setValue] = useCartStore(
    (state) => [
      state.restaurantId,
      state.setRestaurantId,
    ],
  )
  const { isFetching, data } = useGetWarehouses()

  if (isFetching) {
    return (
      <Skeleton
        width="100%"
        height={52}
        variant="rounded"
        sx={{
          borderRadius: '44px',
        }}
      />
    )
  }

  return (
    <FormControl fullWidth>
      <InputLabel id="restaurants-filter">Склад</InputLabel>
      <Select<number>
        label="Склад"
        labelId="restaurants-filter"
        value={value || ''}
        onChange={(event) => {
          const warehouseId = Number(event.target.value)
          setValue(warehouseId)
        }}
        size="medium"
      >
        {data?.data.map((item) => (
          <MenuItem
            key={item.id}
            value={item.id}
          >
            {item.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
