import { useState, useEffect } from 'react'
import { Control, Controller, FieldValues, Path } from 'react-hook-form'
import {
  Autocomplete,
  TextField,
  CircularProgress,
  InputAdornment,
  IconButton,
  Box,
  Typography,
} from '@mui/material'
import AddIcon from '@icons/add-fill.svg?react'

import { useSearchCounterparties, CounterpartySearchResult } from '../api/search-counterparties'

interface Props<T extends FieldValues> {
  name: Path<T>
  control: Control<T>
  label: string
  disabled?: boolean
  onAddClick: () => void
  counterpartyType?: string  // New prop for filtering by type
}

export const CounterpartySearch = <T extends FieldValues>({
  name,
  control,
  label,
  disabled,
  onAddClick,
  counterpartyType,
}: Props<T>) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [inputValue, setInputValue] = useState('')
  const [selectedCounterparty, setSelectedCounterparty] = useState<CounterpartySearchResult | null>(null)
  const { data, isFetching } = useSearchCounterparties(debouncedSearchTerm, counterpartyType)

  // Debounce search term - wait 500ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)

    return () => {
      clearTimeout(timer)
    }
  }, [searchTerm])

  // Clear selected counterparty when type changes
  useEffect(() => {
    setSelectedCounterparty(null)
    setInputValue('')
    setSearchTerm('')
  }, [counterpartyType])

  const options = data?.data || []

  // Show loading when debouncing or fetching
  const isSearching = isFetching || (searchTerm !== debouncedSearchTerm && searchTerm.length >= 2)

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        // Find the selected option based on the value (counterparty ID)
        // Use cached selected counterparty if not found in current options
        const selectedOption = options.find((opt) => opt.id === value) ||
                              (selectedCounterparty?.id === value ? selectedCounterparty : null)

        return (
          <Autocomplete
            options={options}
            loading={isSearching}
            disabled={disabled}
            value={selectedOption}
            inputValue={inputValue}
            onInputChange={(_, newInputValue) => {
              setInputValue(newInputValue)
              setSearchTerm(newInputValue)
            }}
            onChange={(_, newValue) => {
              setSelectedCounterparty(newValue)
              onChange(newValue?.id || 0)
            }}
            getOptionLabel={(option) => option.counterparty || ''}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            noOptionsText={
              searchTerm.length < 2 ? (
                'Введите минимум 2 символа'
              ) : isSearching ? (
                'Поиск...'
              ) : (
                <Box sx={{ textAlign: 'center', py: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Ничего не найдено
                  </Typography>
                </Box>
              )
            }
            renderOption={(props, option) => (
              <li {...props} key={option.id}>
                <Box sx={{ width: '100%' }}>
                  <Typography variant="body1" fontWeight={500}>
                    {option.counterparty}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {option.name} • {option.type_label}
                  </Typography>
                </Box>
              </li>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label={label}
                error={Boolean(error)}
                helperText={error?.message}
                placeholder="Введите имя для поиска"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {isSearching ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {!isSearching && debouncedSearchTerm && options.length === 0 && debouncedSearchTerm.length >= 2 && (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={onAddClick}
                            edge="end"
                            size="small"
                            sx={{
                              color: 'primary.main',
                              '&:hover': {
                                backgroundColor: 'rgba(0, 84, 86, 0.08)',
                              },
                            }}
                          >
                            <AddIcon width={20} height={20} />
                          </IconButton>
                        </InputAdornment>
                      )}
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

