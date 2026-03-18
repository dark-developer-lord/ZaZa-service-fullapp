import { Control, Controller, FieldValues, Path } from 'react-hook-form'
import { Autocomplete, CircularProgress, TextField } from '@mui/material'

import { CategoryItem, useGetAllCategories } from '@entities/category'

interface Props<Dto extends FieldValues> {
  control: Control<Dto>
  storeId: number | null
}

export const CategorySelect = <Dto extends FieldValues>({
  control,
  storeId
}: Props<Dto>) => {
  const { data, isFetching } = useGetAllCategories(storeId)

  return (
    <Controller<Dto>
      name={'parent_id' as Path<Dto>}
      control={control}
      disabled={!data || isFetching}
      render={({ field, fieldState }) => {
        return (
          <Autocomplete<CategoryItem>
            id="category-select"
            options={data?.data || []}
            fullWidth
            value={data?.data.find((item) => item.id === field.value) || null}
            getOptionLabel={(option) => option.name}
            onChange={(_, value) => field.onChange(value?.id)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Категория"
                error={Boolean(fieldState.error)}
                helperText={fieldState.error?.message}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {isFetching ? (
                        <CircularProgress
                          color="inherit"
                          size={20}
                        />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        )
      }}
    />
  )
}
