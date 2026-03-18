import { Control, Controller } from 'react-hook-form'
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material'

import { CreateDto } from '../model/dto'

interface Props {
  control: Control<CreateDto>
}

export const SelectType = ({ control }: Props) => {
  return (
    <Controller
      name="earning"
      control={control}
      render={({ field, fieldState }) => (
        <FormControl fullWidth>
          <InputLabel id="select-type">Тип</InputLabel>
          <Select
            label="Тип"
            labelId="select-type"
            size="medium"
            error={Boolean(fieldState.error)}
            {...field}
          >
            <MenuItem value={0}>Зарплата</MenuItem>
            <MenuItem value={1}>Фрилансер</MenuItem>
          </Select>
          <FormHelperText error>{fieldState.error?.message}</FormHelperText>
        </FormControl>
      )}
    />
  )
}
