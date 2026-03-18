import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
} from '@mui/material'

import { useGetTransactionType } from '@features/finance'
import { TransactionType } from '@features/analytic/cash-flow/filter-orders/model/store'

interface Props {
    value: TransactionType | null,
    changeValue: (value: TransactionType | number | null) => void
}

export function TransactionTypeSelect({ value, changeValue }: Props) {
    const { data, isFetching } = useGetTransactionType()

    return (
        <FormControl fullWidth>
            <InputLabel id="transaction-type-select">Тип операции</InputLabel>
            <Select
                label="Тип операции"
                labelId="transaction-type-select"
                size="medium"
                disabled={isFetching || !data}
                value={value}
                onChange={(event) => {
                    const type = event.target.value as TransactionType
                    changeValue(type)
                }}
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
        </FormControl>
    )
}