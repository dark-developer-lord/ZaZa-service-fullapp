import { useEffect } from 'react'
import { Autocomplete, TextField } from '@mui/material'
import { useCartStore } from '../../model/cart-store'

export const SelectAddress = () => {
  const [customer, address, setAddress] = useCartStore((state) => [
    state.customer,
    state.address,
    state.setAddress,
  ])

  useEffect(() => {
    if (customer?.default_address) {
      setAddress(customer.default_address)
    } else if (!customer) {
      setAddress('')
    }
  }, [customer, setAddress])

  return (
    <Autocomplete
      freeSolo
      id="search-address"
      disableClearable
      options={customer?.addresses || []}
      getOptionLabel={(option) =>
        typeof option === 'string' ? option : option.road || ''
      }
      isOptionEqualToValue={(option, value) =>
        (typeof option === 'string' ? option : option.road) ===
        (typeof value === 'string' ? value : value.road)
      }
      disabled={!customer}
      value={address || ''}
      inputValue={address || ''}
      onInputChange={(_, newInputValue) => {
        setAddress(newInputValue)
      }}
      onChange={(_, newValue) => {
        const addressValue = typeof newValue === 'string' ? newValue : newValue?.road || ''
        setAddress(addressValue)
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={customer ? "Адрес доставки" : "Адрес доставки (необязательно)"}
          placeholder={customer ? "Выберите или введите адрес" : "Введите адрес доставки"}
          helperText={!customer ? "Клиент не выбран - можно указать любой адрес" : ""}
          InputProps={{
            ...params.InputProps,
            type: 'search',
          }}
        />
      )}
    />
  )
}
