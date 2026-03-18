import { 
    FormControl, 
    InputLabel, 
    MenuItem,
    Select, 
} from '@mui/material'

import { useGetTransactionCategories } from '@features/finance'

interface Props {
    value: number | null,
    changeValue: (value: number | null) => void
}

export function CategorySelect({ value, changeValue }: Props) {
    const { data, isFetching } = useGetTransactionCategories()
    return (
        <FormControl fullWidth>
            <InputLabel id="category-select">Категория</InputLabel>
            <Select
                label="Категория"
                labelId="category-select"
                size="medium"
                disabled={isFetching || !data}
                value={value}
                onChange={(event) => {
                    const type = Number(event.target.value)
                    changeValue(type)
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
        </FormControl>
    )
}