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
} from '@mui/material'

import { CreateCashFlowDto } from '@features/finance'
import { useGetTransactionType } from '../api/get-transaction-types'

interface Props {
    control: Control<CreateCashFlowDto>
    disabled?: boolean
}

export function TransactionTypeSelect({ control, disabled = false }: Props) {
    const { data, isFetching } = useGetTransactionType()
    
    return (
        <Controller
            name="type"
            control={control}
            render={({ field, fieldState }) => (
                <FormControl fullWidth>
                    <InputLabel id="transaction-type-select">Тип операции</InputLabel>
                    <Select
                        label="Тип операции"
                        labelId="transaction-type-select"
                        size="medium"
                        error={Boolean(fieldState.error)}
                        disabled={isFetching || !data || disabled}
                        {...field}
                    >
                        {data?.data.map((item) => (
                            <MenuItem
                                key={item.value}
                                value={item.value}
                            >
                                {item.label}
                            </MenuItem>
                        ))}
                    </Select>
                    <FormHelperText error>{fieldState.error?.message}</FormHelperText>
                </FormControl>
            )}
        />
    )
}