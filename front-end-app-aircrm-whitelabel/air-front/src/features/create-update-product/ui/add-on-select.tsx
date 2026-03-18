import { Control, Controller } from 'react-hook-form'
import toast from 'react-hot-toast'
import {
  Box,
  Chip,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material'

import { useGetRestaurantAddOns } from '@entities/add-on'

import { CreateDto } from '../model/dto'

interface Props {
  control: Control<CreateDto>
  restaurantId?: number
}

export const AddOnSelect = ({ control, restaurantId }: Props) => {
  const { data, isFetching } = useGetRestaurantAddOns(restaurantId)
  return (
    <Controller
      name={'addon_ids' as any}
      control={control as any}
      render={({ field, fieldState }) => (
        <FormControl fullWidth>
          <InputLabel id="select-add-ons">Дополнение</InputLabel>
          <Select
            {...field}
            label="Дополнение"
            labelId="select-add-ons"
            multiple
            disabled={isFetching || !restaurantId}
            onClick={() => {
              if (!restaurantId) {
                toast('Сначала выберите ресторан')
              }
            }}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {data?.data
                  .filter((addOn) => selected?.includes(addOn.id))
                  .map(({ id, name }) => (
                    <Chip
                      key={id}
                      label={name}
                    />
                  ))}
              </Box>
            )}
          >
            {data?.data.map((addOn) => (
              <MenuItem
                key={addOn.id}
                value={addOn.id}
              >
                {addOn.name}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText error={Boolean(fieldState.error)}>
            {fieldState.error?.message}
          </FormHelperText>
        </FormControl>
      )}
    />
  )
}
