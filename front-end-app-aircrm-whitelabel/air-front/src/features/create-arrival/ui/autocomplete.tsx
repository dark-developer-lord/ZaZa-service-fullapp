import { useEffect, useState }  from 'react';
import { useNavigate } from 'react-router-dom';
import { Control, Controller, UseFormSetValue, UseFormGetValues, UseFormWatch } from 'react-hook-form'
import { useDebounceCallback } from 'usehooks-ts'

import {
    Autocomplete,
    FormControl,
    FormHelperText,
    TextField,
    CircularProgress,
    createFilterOptions
} from '@mui/material'

import { ArrivalDto } from '../model/dto'
import { RouterPaths } from '@shared/lib';
import { useGetProducts } from '@entities/warehouse/';

const filter = createFilterOptions();

interface Props {
    control: Control<ArrivalDto>,
    setValue: UseFormSetValue<ArrivalDto>,
    getFormValues: UseFormGetValues<ArrivalDto>,
    watch: UseFormWatch<ArrivalDto>,
    index: number
    disabled?: boolean
}
export function FreeSoloCreateOptionDialog({ control, setValue, getFormValues, watch, index, disabled = false }: Props) {
  const [searchTerm, setSearchTerm] = useState('')
  const [inputValue, setInputValue] = useState('')
  const debouncedSearchTerm = useDebounceCallback(setSearchTerm, 500)

  useEffect(() => {
    return () => {
      setSearchTerm('')
    }
  }, [])

  const { data, isFetching } = useGetProducts(getFormValues('warehouse_id'), searchTerm)
  const navigate = useNavigate()

  const currentProduct = watch(`products.${index}`)

  // Sync inputValue with product name when product changes (especially important when disabled)
  useEffect(() => {
    if (currentProduct) {
      const productName = typeof currentProduct === 'string' 
        ? currentProduct 
        : ((currentProduct as any).name || (currentProduct as any).product_name || '')
      if (productName && inputValue !== productName) {
        setInputValue(productName)
      }
    } else if (!currentProduct) {
      // Clear inputValue if product is cleared
      if (inputValue) {
        setInputValue('')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProduct])

  return (
      <Autocomplete
        freeSolo
        options={data?.data || []}
        loading={isFetching}
        loadingText="Загрузка..."
        value={currentProduct as any}
        inputValue={inputValue}
        disabled={disabled}
        onInputChange={(event, newInputValue) => {
          if (disabled) return
          setInputValue(newInputValue)
          if (event !== null) {
            if (event.type === 'change') {
              debouncedSearchTerm(newInputValue)
              // Auto-set product_name as user types (for creating new products)
              if (newInputValue) {
                setValue(`products.${index}.product_name`, newInputValue)
              }
            }
          }
        }}
        noOptionsText="Нет найденных товаров"
        onChange={(_, newValue) => {
          if (disabled) return
          if (newValue) {
            if (typeof newValue === 'string') {
              // User typed a value and pressed Enter or clicked away
              setValue(`products.${index}.product_id`, null)
              setValue(`products.${index}.product_name`, newValue)
            } else if ((newValue as any)?.inputValue) {
              // User selected "Добавить..." option - keep the typed value
              setValue(`products.${index}.product_id`, null)
              setValue(`products.${index}.product_name`, (newValue as any).inputValue)
              setInputValue((newValue as any).inputValue)
            } else {
              // User selected an existing product
              setValue(`products.${index}.product_id`, newValue.id)
              setValue(`products.${index}.product_name`, newValue.name)
              setInputValue(newValue.name)
            }
          } else {
            setValue(`products.${index}.product_id`, null)
            setValue(`products.${index}.product_name`, '')
            setInputValue('')
          }
        }}
        getOptionLabel={(option) => {
          if (typeof option === 'string') {
            return option
          }
          return (option as any).name || (option as any).product_name || ''
        }}
        filterOptions={(options, params) => {
          const filtered = filter(options as any[], params as any) as any[];

          if (params.inputValue !== '' && !filtered.length) {
            filtered.push({
              inputValue: params.inputValue,
              name: `Создать "${params.inputValue}"`
            })
          }
          return filtered
        }}
        isOptionEqualToValue={(option, value) => {
          if (typeof option === 'string' && typeof value === 'string') {
            return option === value
          }
          if (typeof option === 'object' && typeof value === 'object') {
            return option.id === value.id || option.name === value.name
          }
          return false
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Товары"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {isFetching ? (
                    <CircularProgress
                      color="inherit"
                      size={15}
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
}