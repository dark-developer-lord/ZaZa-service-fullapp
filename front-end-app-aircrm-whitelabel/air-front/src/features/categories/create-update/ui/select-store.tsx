import { Control, Controller } from "react-hook-form"

import { CreateDto, UpdateDto } from '../model/dto'
import { FormControl, InputLabel, FormHelperText, Select, MenuItem } from "@mui/material"

import { useGetStoresList } from "@entities/stores"

interface Props {
    control: Control<CreateDto | UpdateDto>
}

export const SelectStore = ({ control }: Props) => {
    const { data, isFetching } = useGetStoresList()
    return (
        <Controller
            name="store_id"
            control={control}
            render={({ field, fieldState }) => (
                <FormControl fullWidth>
                    <InputLabel id="select-store">Магазин</InputLabel>
                    <Select
                        label="Магазин"
                        labelId="select-store"
                        size="medium"
                        error={Boolean(fieldState.error)}
                        disabled={isFetching || !data}
                        {...field}
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
    )
}