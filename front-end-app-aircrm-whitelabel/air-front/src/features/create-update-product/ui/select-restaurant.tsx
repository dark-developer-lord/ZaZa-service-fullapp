import { useEffect, useState } from 'react'
import { Control, Controller, UseFormSetValue } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import {
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material'

import { useGetMainRestaurants } from '@entities/warehouses'

import { CreateDto } from '../model/dto'

interface Props {
  control: Control<CreateDto>
  setValue: UseFormSetValue<CreateDto>
  restaurantId: number | null
}

export const SelectRestaurant = ({
  control,
  setValue,
  restaurantId,
}: Props) => {
  const params = useParams()
  const { data } = useGetMainRestaurants()
  const [mainRestaurantId, setMainRestaurantId] = useState<number | null>(null)
  const restaurant = data?.data.find((item) => item.id === mainRestaurantId)

  useEffect(() => {
    if (data) {
      const mainRestaurant = data.data.find((item) =>
        item.available_zones.find(
          (zone) => zone.restaurant_id === restaurantId,
        ),
      )
      if (mainRestaurant && restaurantId) {
        setMainRestaurantId(mainRestaurant.id)
        setValue('restaurant_id' as any, restaurantId)
      }
    }
  }, [data, restaurantId])

  return (
    <>
      <Grid
        item
        xs={4}
      >
        <FormControl fullWidth>
          <InputLabel id="select-restaurant">Магазины</InputLabel>
          <Select
            label="Магазины"
            labelId="select-restaurant"
            size="medium"
            error={!mainRestaurantId}
            value={mainRestaurantId || ''}
            disabled={Boolean(params.id)}
            onChange={(event) => {
              const restaurantId = Number(event.target.value)
              setMainRestaurantId(restaurantId)
              setValue('restaurant_id' as any, restaurantId)
            }}
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
          {!mainRestaurantId && (
            <FormHelperText error>Выберите магазин</FormHelperText>
          )}
        </FormControl>
      </Grid>
      <Grid
        item
        xs={4}
      >
        <Controller
          name={'restaurant_id' as any}
          control={control}
          render={({ field, fieldState }) => (
            <FormControl fullWidth>
              <InputLabel id="select-zone">Склады</InputLabel>
              <Select
                label="Склады"
                labelId="select-zone"
                size="medium"
                error={Boolean(fieldState.error) || !restaurantId}
                disabled={!mainRestaurantId || Boolean(params.id)}
                {...field}
              >
                {restaurant?.available_zones.map(({ restaurant_id, zone }) => (
                  <MenuItem
                    key={restaurant_id}
                    value={restaurant_id}
                  >
                    {zone.name}
                  </MenuItem>
                ))}
              </Select>
              {!restaurantId && (
                <FormHelperText error>Выберите склад</FormHelperText>
              )}
            </FormControl>
          )}
        />
      </Grid>
    </>
  )
}
