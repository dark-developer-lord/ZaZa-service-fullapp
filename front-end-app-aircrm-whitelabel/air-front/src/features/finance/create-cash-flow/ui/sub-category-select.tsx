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
import { useGetTransactionSubCategories } from '../api/get-transaction-subcategories'
import { useStore as useCreateSubCategoryDialogStore } from '@features/transaction-sub-categories/create-update/model/store'

interface Props {
    control: Control<CreateCashFlowDto>
    categoryId: number
    disabled?: boolean
}

export function SubCategorySelect({ control, categoryId, disabled = false }: Props) {
    const { data, isFetching } = useGetTransactionSubCategories(categoryId)
    const openCreateSubCategory = useCreateSubCategoryDialogStore((state) => state.openCreate)

    return (
        <Controller
            name="subcategory_id"
            control={control}
            render={({ field, fieldState }) => (
                <FormControl fullWidth>
                    <InputLabel id="sub-category-select">Подкатегория</InputLabel>
                    <Select
                        label="Подкатегория"
                        labelId="sub-category-select"
                        size="medium"
                        error={Boolean(fieldState.error)}
                        disabled={isFetching || !data || disabled}
                        value={field.value ?? ''}
                        onChange={(e) => {
                            const value = e.target.value
                            if (value === 'create_new') {
                                openCreateSubCategory()
                            } else if (value === '' || value === null || value === undefined) {
                                field.onChange(null)
                            } else {
                                // Always convert to number since MenuItem values are numbers
                                const numValue = Number(value)
                                field.onChange(isNaN(numValue) ? null : numValue)
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
                            <ListItemText primary="Создать подкатегорию" />
                        </MenuItem>
                    </Select>
                    <FormHelperText error>{fieldState.error?.message}</FormHelperText>
                </FormControl>
            )}
        />
    )
}