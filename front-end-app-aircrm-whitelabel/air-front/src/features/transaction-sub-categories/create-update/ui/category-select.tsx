import { Control, Controller, FieldValues, Path } from 'react-hook-form'
import { Autocomplete, CircularProgress, TextField } from '@mui/material'

import { TransactionCategoryItem } from '@entities/transaction-category'
import { useGetTransactionCategories } from '@features/finance/create-cash-flow/api/get-transaction-categories'

interface Props<Dto extends FieldValues> {
  control: Control<Dto>
}

export const TransactionCategorySelect = <Dto extends FieldValues>({
  control,
}: Props<Dto>) => {
  const { data, isFetching } = useGetTransactionCategories()

  return (
    <Controller<Dto>
      name={'parent_id' as Path<Dto>}
      control={control}
      disabled={!data || isFetching}
      render={({ field, fieldState }) => {
        return (
          <Autocomplete<TransactionCategoryItem>
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
