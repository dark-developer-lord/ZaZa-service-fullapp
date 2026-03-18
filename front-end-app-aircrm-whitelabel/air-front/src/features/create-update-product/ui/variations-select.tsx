import { Control, Controller } from 'react-hook-form'
import {
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material'

import { CreateDto, UpdateDto } from '../model/dto'
import { useGetVariations } from '../api/get-variations'

interface Props {
  control: Control<CreateDto> | Control<UpdateDto>
}

export const VariationsSelect = ({ control }: Props) => {
  const { data, isFetching } = useGetVariations()

  return (
    <Grid item xs={12} mobile={3}>
      <Controller
        name={'variation_type' as any}
        control={control as any}
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
