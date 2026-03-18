import {
    Control,
    Controller,
} from 'react-hook-form'

import {
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select,
    ListItemIcon,
    ListItemText,
    Divider,
} from '@mui/material'
import AddIcon from '@icons/add-fill.svg?react'

import { CreateCashFlowDto } from '@features/finance'
import { useGetTransactionCategories } from '../api/get-transaction-categories'
import { useStore as useCreateCategoryDialogStore } from '@features/transaction-categories/create-update/model/store'

interface Props {
    control: Control<CreateCashFlowDto>
    disabled?: boolean
}

export function CategorySelect({ control, disabled = false }: Props) {
    const { data, isFetching } = useGetTransactionCategories()
    const openCreateCategory = useCreateCategoryDialogStore((state) => state.openCreate)

    return (
        <Controller
            name="category_id"
            control={control}
            render={({ field, fieldState }) => (
                <FormControl fullWidth>
                    <InputLabel id="category-select">Категория</InputLabel>
                    <Select
                        label="Категория"
                        labelId="category-select"
                        size="medium"
                        error={Boolean(fieldState.error)}
                        disabled={isFetching || !data || disabled}
                        {...field}
                        onChange={(e) => {
                            if (e.target.value === 'create_new') {
                                openCreateCategory()
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
                            <ListItemText primary="Создать категорию" />
                        </MenuItem>
                    </Select>
                    <FormHelperText error>{fieldState.error?.message}</FormHelperText>
                </FormControl>
            )}
        />
    )
}