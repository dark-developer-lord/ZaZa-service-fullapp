import { useEffect, useState } from 'react'
import { Autocomplete, CircularProgress, TextField, Box, Typography, Button } from '@mui/material'
import { useDebounceCallback } from 'usehooks-ts'

import { useSearchCustomer } from '@entities/customer'
import AddIcon from '@icons/add-fill.svg?react'

import { useCartStore } from '../../model/cart-store'
import { AddCustomer } from './add-customer'

export const CustomerInput = () => {
  const [customer, setCustomer, setAddress] = useCartStore((state) => [
    state.customer,
    state.setCustomer,
    state.setAddress,
  ])
  const [searchTerm, setSearchTerm] = useState('')
  const [openedAddClient, setOpenedAddClient] = useState(false)
  const debouncedSearchTerm = useDebounceCallback(setSearchTerm, 500)

  useEffect(() => {
    return () => {
      setSearchTerm('')
    }
  }, [])

  const { isLoading, data } = useSearchCustomer(searchTerm)

  const hasSearched = searchTerm.length > 2
  const hasNoResults = hasSearched && !isLoading && (!data?.data || data.data.length === 0)

  return (
    <>
      <Autocomplete
        options={data?.data || []}
        loading={isLoading}
        loadingText="Загрузка..."
        onInputChange={(event, newInputValue) => {
          if (event !== null) {
            if (event.type === 'change') {
              debouncedSearchTerm(newInputValue)
              setAddress('')
            }
            if (!newInputValue && event.type === 'click') {
              setCustomer(null)
              setAddress('')
            }
          }
        }}
        noOptionsText={
          hasNoResults ? (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Нет найденных клиентов, хотите добавить?
              </Typography>
              <Button
                size="small"
                variant="contained"
                color="primary"
                startIcon={<AddIcon width={16} height={16} fill="white" />}
                onClick={() => setOpenedAddClient(true)}
              >
                Добавить клиента
              </Button>
            </Box>
          ) : (
            'Нет найденных клиентов'
          )
        }
        value={customer}
        onChange={(_, newValue) => {
          if (newValue && typeof newValue !== 'string') {
            setCustomer(newValue)

            if (newValue.default_address) {
              setAddress(newValue.default_address)
            }
          }
        }}
        getOptionLabel={(option) => {
          if (typeof option === 'string') {
            return option
          }
          return `${option.name} ${option.phone}`
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Клиент (необязательно)"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {isLoading ? (
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

      <AddCustomer
        opened={openedAddClient}
        onClose={() => setOpenedAddClient(false)}
      />
    </>
  )
}
