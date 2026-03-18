import { 
    FormControl, 
    InputLabel, 
    MenuItem,
    Select, 
} from '@mui/material'

import { useGetTransactionSubCategories } from '@features/finance'

interface Props {
    value: number | null,
    changeValue: (value: number | null) => void
    categoryId: number 
}

export function SubCategorySelect({ value, changeValue, categoryId }: Props) {
    const { data, isFetching } = useGetTransactionSubCategories(categoryId)
    return (
        <FormControl fullWidth>
            <InputLabel id="sub-category-select">Подкатегория</InputLabel>
            <Select
                label="Подкатегория"
                labelId="sub-category-select"
                size="medium"
                disabled={isFetching || !data}
                value={value}
                onChange={(event) => {
                    const type = Number(event.target.value)
                    changeValue(type)
                }}
            >
                {/* <MenuItem value=""><em>None</em></MenuItem> */}
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