import { Control, Controller } from 'react-hook-form'
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material'

import { useGetAdminRoles } from '@entities/admin-roles'

import { CreateDto } from '../model/dto'

interface Props {
  control: Control<CreateDto>
}

export const SelectRole = ({ control }: Props) => {
  const { data } = useGetAdminRoles()

  return (
    <Controller
      name="role_id"
      control={control}
      render={({ field, fieldState }) => (
        <FormControl fullWidth>
          <InputLabel>Роль</InputLabel>
          <Select
            {...field}
            label="Роль"
            error={Boolean(fieldState.error)}
          >
            {data?.data.map((role) => (
              <MenuItem
                key={role.id}
                value={role.id}
              >
                {role.name}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText error>{fieldState.error?.message}</FormHelperText>
        </FormControl>
      )}
    />
  )
}
