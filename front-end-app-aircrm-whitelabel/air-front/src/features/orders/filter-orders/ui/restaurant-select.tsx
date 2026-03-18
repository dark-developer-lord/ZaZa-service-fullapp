import { useEffect, useState } from 'react'
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
  Stack,
} from '@mui/material'

import { useGetSources } from '@entities/warehouses'

interface Props {
  value: number | null
  sourceType: 'store' | 'warehouse'
  changeStore: (value: number | null) => void
  changeWarehouse: (value: number | null) => void
}

export const RestaurantSelect = ({ value, sourceType, changeStore, changeWarehouse }: Props) => {
  const [sourceId, setSourceId] = useState<number | null>(null)
  const { isFetching, data } = useGetSources()
  const sources: any[] = []
  let storesAmount: number = 0
  // const restaurant = data?.data.find((item) => item.id === mainRestaurantId)

  // useEffect(() => {
  //   if (data) {
  //     const mainRestaurant = data.data.find((item) =>
  //       item.available_zones.find((zone) => zone.restaurant_id === value),
  //     )
  //     if (mainRestaurant) {
  //       setMainRestaurantId(mainRestaurant.id)
  //       change(value)
  //     }
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [data])

  useEffect(() => {
    if (data && value) {
      let source = sources.find(source => {
        if (sourceType === 'store') {
          return source.sourceId < storesAmount && source.id === value
        }
        return source.sourceId >= storesAmount && source.id === value
      })
      setSourceId(source.sourceId)
    }
  }, [data])

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

  storesAmount = (data as any).stores.length;
  Object.values(data as any).forEach((source: any) => {
    source.forEach((item: any) => sources.push({ sourceId: sources.length, ...item}))
  })

  return (
    <Stack spacing="24px">
      <FormControl fullWidth>
        <InputLabel id="restaurants-filter">Магазины</InputLabel>
        <Select
          label="Магазины"
          labelId="restaurants-filter"
          value={sourceId !== null ? sourceId : ''}
          onChange={(event) => {
            const sourceId = Number(event.target.value)
            setSourceId(sourceId)
            if (sourceId < storesAmount) {
              changeStore(sources[sourceId].id)
              changeWarehouse(null)
            } else {
              changeWarehouse(sources[sourceId].id)
              changeStore(null)
            }
            // change(restaurantId)
          }}
          size="medium"
        >
          {sources.map((item, index) => (
            <MenuItem
              key={item.id + index}
              value={item.sourceId}
            >
              {item.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {/* {restaurant && (
        <FormControl fullWidth>
          <InputLabel id="zone-select">Зона</InputLabel>
          <Select
            label="Зона"
            labelId="zone-select"
            value={value || ''}
            onChange={(event) => {
              change(Number(event.target.value))
            }}
            size="medium"
          >
            {restaurant.available_zones.map(({ restaurant_id, zone }) => (
              <MenuItem
                key={restaurant_id}
                value={restaurant_id}
              >
                {zone.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )} */}
    </Stack>
  )
}
