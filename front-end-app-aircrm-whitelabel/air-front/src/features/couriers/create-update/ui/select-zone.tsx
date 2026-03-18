import { Control, Controller } from 'react-hook-form'
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
} from '@mui/material'

import { useGetZones } from '@entities/zone'

import { CreateDto } from '../model/dto'

interface Props {
  control: Control<CreateDto>
}

export const SelectZone = ({ control }: Props) => {
  const { isFetching, data } = useGetZones()

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
      name={'zone_id' as any}
      control={control}
      render={({ field, fieldState }) => (
        <FormControl fullWidth>
          <InputLabel id="select-zone">Зона</InputLabel>
          <Select
            label="Зона"
            labelId="select-zone"
            size="medium"
            error={Boolean(fieldState.error)}
            {...field}
          >
            {data?.map((item) => (
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
