import { useState, useEffect } from 'react'
import { Control, Controller, UseFormSetValue, useWatch } from 'react-hook-form'
import {
  Autocomplete,
  TextField,
  CircularProgress,
  Box,
  Typography,
  IconButton,
  InputAdornment,
} from '@mui/material'
import AddIcon from '@icons/add-fill.svg?react'

import { useSearchCounterparties, CounterpartySearchResult } from '@features/finance/schedule-transaction/api/search-counterparties'
import { CreateSupplierModal } from '@features/create-update-product/ui/document-processing/create-supplier-modal'

import { ArrivalDto } from '../model/dto'

interface Props {
  control: Control<ArrivalDto>
  setValue: UseFormSetValue<ArrivalDto>
  disabled?: boolean
}

export const SupplierSearch = ({ control, setValue, disabled = false }: Props) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [inputValue, setInputValue] = useState('')
  const [selectedSupplier, setSelectedSupplier] = useState<CounterpartySearchResult | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Watch form values to sync with local state
  const counterpartyId = useWatch({ control, name: 'counterparty_id' })
  const counterpartyName = useWatch({ control, name: 'counterparty_name' })
  const contact = useWatch({ control, name: 'contact' })
  const companyName = useWatch({ control, name: 'company_name' })
  const address = useWatch({ control, name: 'address' })
  const inn = useWatch({ control, name: 'inn' })

  // Sync local state when form values change (e.g., when form is reset with API data)
  useEffect(() => {
    if (counterpartyId && counterpartyName && !selectedSupplier) {
      // Form has a counterparty but local state doesn't - sync it
      const supplier: CounterpartySearchResult = {
        id: counterpartyId,
        counterparty: counterpartyName,
        name: companyName || '',
        phone: contact || '',
        address: address || '',
        requisite: inn || '',
        type: 'supplier',
        type_label: 'Поставщик',
        balance: '0',
        status: 'active',
        status_label: 'Активный',
        photo: null,
      }
      setSelectedSupplier(supplier)
      setInputValue(counterpartyName)
    } else if (!counterpartyId && selectedSupplier) {
      // Form was cleared but local state still has a supplier - clear it
      setSelectedSupplier(null)
      setInputValue('')
    }
  }, [counterpartyId, counterpartyName, companyName, contact, address, inn, selectedSupplier])

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)

    return () => {
      clearTimeout(timer)
    }
  }, [searchTerm])

  const { data, isFetching } = useSearchCounterparties(debouncedSearchTerm, 'supplier')

  const options = data?.data || []
  const isSearching = isFetching && debouncedSearchTerm.length >= 2

  const handleSupplierChange = (supplier: CounterpartySearchResult | null) => {
    setSelectedSupplier(supplier)

    if (supplier) {
      console.log('Selected supplier:', supplier)
      // Auto-fill related fields
      setValue('counterparty_id', supplier.id, { shouldValidate: true })
      setValue('counterparty_name', supplier.counterparty, { shouldValidate: true })
      setValue('contact', supplier.phone || '', { shouldValidate: true })
      setValue('company_name', supplier.name || '', { shouldValidate: true })
      setValue('address', supplier.address || '', { shouldValidate: true })
      setValue('inn', supplier.requisite || '', { shouldValidate: true })
      console.log('Set address:', supplier.address)
      console.log('Set inn:', supplier.requisite)
    } else {
      // Clear fields
      setValue('counterparty_id', 0, { shouldValidate: true })
      setValue('counterparty_name', '', { shouldValidate: true })
      setValue('contact', '', { shouldValidate: true })
      setValue('company_name', '', { shouldValidate: true })
      setValue('address', '', { shouldValidate: true })
      setValue('inn', '', { shouldValidate: true })
    }
  }

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleSupplierCreated = (supplier: any) => {
    // Auto-select the newly created supplier
    const newSupplier: CounterpartySearchResult = {
      id: supplier.id,
      counterparty: supplier.counterparty,
      name: supplier.name,
      phone: supplier.phone,
      address: supplier.address,
      requisite: supplier.requisite,
      type: supplier.type,
      type_label: supplier.type_label,
      balance: supplier.balance,
      status: supplier.status,
      status_label: supplier.status_label,
      photo: supplier.photo,
    }
    handleSupplierChange(newSupplier)
    setInputValue(supplier.counterparty || '')
  }

  return (
    <>
      <CreateSupplierModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSupplierCreated={handleSupplierCreated}
      />
      <Controller
        name="counterparty_id"
        control={control}
        render={({ field: { value }, fieldState: { error } }) => {
          return (
            <Autocomplete
              options={options}
              value={selectedSupplier}
              inputValue={inputValue}
              disabled={disabled}
              onInputChange={(_, newInputValue) => {
                setInputValue(newInputValue)
                setSearchTerm(newInputValue)
              }}
              onChange={(_, newValue) => {
                handleSupplierChange(newValue)
              }}
              getOptionLabel={(option) => option.counterparty || ''}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              loading={isSearching}
              loadingText="Поиск..."
              noOptionsText={
                debouncedSearchTerm.length < 2 ? (
                  "Введите минимум 2 символа для поиска"
                ) : (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1,
                      py: 1,
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                      }
                    }}
                    onClick={handleOpenModal}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Поставщик не найден
                    </Typography>
                    <IconButton
                      size="small"
                      sx={{
                        color: 'primary.main',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 84, 86, 0.08)',
                        }
                      }}
                    >
                      <AddIcon width={16} height={16} />
                    </IconButton>
                  </Box>
                )
              }
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  <Box>
                    <Typography variant="body1" fontWeight={500}>
                      {option.counterparty}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {option.name}
                      {option.requisite && ` • ИНН: ${option.requisite}`}
                      {option.address && ` • ${option.address}`}
                    </Typography>
                  </Box>
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Поставщик"
                  error={Boolean(error)}
                  helperText={error?.message}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {isSearching ? <CircularProgress color="inherit" size={20} /> : null}
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
    </>
  )
}

