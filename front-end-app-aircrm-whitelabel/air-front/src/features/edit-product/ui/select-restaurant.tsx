import { Control, Controller } from 'react-hook-form'
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
} from '@mui/material'

import { useGetRestaurants } from '@entities/warehouses'

import { Dto } from '../model/dto'

interface Props {
  control: Control<Dto>
}

export const SelectRestaurant = ({ control }: Props) => {
  const { isFetching, data } = useGetRestaurants()

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
    <Controller
      name="restaurant_id"
      control={control}
      render={({ field, fieldState }) => (
        <FormControl fullWidth>
          <InputLabel id="select-restaurant">Рестораны</InputLabel>
          <Select
            label="Рестораны"
            labelId="select-restaurant"
            size="medium"
            error={Boolean(fieldState.error)}
            {...field}
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
          <FormHelperText error>{fieldState.error?.message}</FormHelperText>
        </FormControl>
      )}
    />
  )
}
