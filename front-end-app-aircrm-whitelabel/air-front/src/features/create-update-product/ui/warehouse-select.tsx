import { Control, Controller } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import {
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material'
import AddIcon from '@icons/add-fill.svg?react'

import { useGetWarehouses } from '@entities/warehouses'
import { RouterPaths } from '@shared/lib'

import { CreateDto } from '../model/dto'

interface Props {
    control: Control<CreateDto>
}

export const WarehouseSelect = ({ control }: Props) => {
    const { data, isFetching } = useGetWarehouses()
    const navigate = useNavigate()

  return (
    <Grid
        item
        xs={12}
        mobile={3}
    >
    <Controller
        name="warehouse_id"
        control={control}
        render={({ field, fieldState }) => (
            <FormControl fullWidth>
                <InputLabel id="source-select">Склад</InputLabel>
                <Select
                    label="Склад"
                    labelId="source-select"
                    size="medium"
                    error={Boolean(fieldState.error)}
                    disabled={isFetching || !data}
                    {...field}
                    onChange={(e) => {
                        if (e.target.value === 'create_new') {
                            navigate(RouterPaths.warehouses)
                        } else {
                            field.onChange(e)
                        }
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
                <Divider />
                <MenuItem value="create_new" sx={{ color: 'primary.main' }}>
                    <ListItemIcon>
                        <AddIcon width={20} height={20} fill="currentColor" />
                    </ListItemIcon>
                    <ListItemText primary="Создать склад" />
                </MenuItem>
                </Select>
                <FormHelperText error>{fieldState.error?.message}</FormHelperText>
            </FormControl>
        )}
    />
    </Grid>
  )
}
