import { Control, Controller } from 'react-hook-form'
import {
  FormControl,
  FormHelperText,
  Grid,
  MenuItem,
  Select,
} from '@mui/material'


import { useGetWarehouses } from '@entities/warehouses'

import { CreateDto } from '../model/dto'

interface Props {
    control: Control<CreateDto>
    disabled?: boolean
}

export const WarehouseSelect = ({ control, disabled = false }: Props) => {
    const { data, isFetching } = useGetWarehouses()

  return (
    <Grid
        item
        xs={12}
    >
    <Controller
        name="warehouse_id"
        control={control}
        render={({ field, fieldState }) => (
        <FormControl fullWidth>
            <Select
                displayEmpty
                labelId="source-select"
                size="medium"
                error={Boolean(fieldState.error)}
                disabled={disabled || isFetching || !data}
                {...field}
                renderValue={(selected) => {
                    if (!selected) {
                        return <span style={{ color: '#9e9e9e' }}>Выберите склад</span>
                    }
                    const warehouse = data?.data.find((item) => item.id === selected)
                    return warehouse?.name
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
            <FormHelperText error>{fieldState.error?.message}</FormHelperText>
        </FormControl>
        )}
    />
    </Grid>
  )
}
