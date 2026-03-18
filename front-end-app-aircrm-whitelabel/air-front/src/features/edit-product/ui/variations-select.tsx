import { Control, Controller } from 'react-hook-form'
import {
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material'

import { Dto } from '../model/dto'
import { useGetVariations } from '../../create-update-product/api/get-variations'

interface Props {
  control: Control<Dto>
}

export const VariationsSelect = ({ control }: Props) => {
  const { data, isFetching } = useGetVariations()

  return (
    <Grid item xs={4}>
      <Controller
        name="variation_type"
        control={control}
        render={({ field, fieldState }) => (
          <FormControl fullWidth>
            <InputLabel id="variations-select">Вариации</InputLabel>
            <Select
              {...field}
              label="Вариации"
              labelId="variations-select"
              error={Boolean(fieldState.error)}
              disabled={isFetching}
            >
              {data?.types.map((variation) => (
                <MenuItem key={variation.value} value={variation.value}>
                  {variation.label}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText error>{fieldState.error?.message}</FormHelperText>
          </FormControl>
        )}
      />
    </Grid>
  )
}
