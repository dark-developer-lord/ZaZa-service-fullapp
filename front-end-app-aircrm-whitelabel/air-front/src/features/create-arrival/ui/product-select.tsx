import { Control, Controller } from 'react-hook-form'
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material'

import { useGetProducts } from '@entities/warehouse'

import { ArrivalDto } from '../model/dto'

interface Props {
  control: Control<ArrivalDto>
  index: number
}

export const ProductSelect = ({ control, index }: Props) => {
  const { data, isFetching } = useGetProducts(1, "")

  return (
    <Controller
      name={`products.${index}.product_id`}
      control={control}
      render={({ field, fieldState }) => (
        <FormControl fullWidth>
          <InputLabel id="product-select">Товары</InputLabel>
          <Select
            label="Товары"
            labelId="product-select"
            size="medium"
            error={Boolean(fieldState.error)}
            disabled={isFetching || !data}
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
