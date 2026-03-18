import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
} from '@mui/material'

import { useGetMainRestaurants } from '@entities/warehouses'

import { useCartStore } from '../model/cart-store'

export const ZoneSelect = () => {
  const { isFetching, data } = useGetMainRestaurants()
  const [mainRestaurantId, restaurantId, setRestaurantId, zoneId, setZoneId] =
    useCartStore((state) => [
      state.mainRestaurantId,
      state.restaurantId,
      state.setRestaurantId,
      state.zoneId,
      state.setZoneId,
    ])

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

  const mainRestaurant = data?.data.find((item) => item.id === mainRestaurantId)

  return (
    <FormControl fullWidth>
      <InputLabel id="zone-filter">Зона</InputLabel>
      <Select
        label="Зона"
        labelId="zone-filter"
        value={zoneId || ''}
        onChange={(event) => {
          const zoneId = Number(event.target.value)
          setZoneId(zoneId)
          const zone = mainRestaurant?.available_zones.find(
            (item) => item.zone.id === zoneId,
          )
          if (mainRestaurant && zone) {
            setRestaurantId(zone.restaurant_id)
          }
        }}
        size="medium"
        disabled={!restaurantId}
      >
        {mainRestaurant?.available_zones.map(({ zone }) => (
          <MenuItem
            key={zone.id}
            value={zone.id}
          >
            {zone.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
