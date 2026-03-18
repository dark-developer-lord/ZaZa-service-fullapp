import { useState, useEffect } from 'react'
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

import { useSearchCounterparties } from '@features/finance/schedule-transaction/api/search-counterparties'

import { CreateSupplierModal } from './create-supplier-modal'

interface Supplier {
  id: number
  counterparty: string
  name: string
  type: string
  type_label: string
  balance: string
  status: string
  status_label: string
  photo: string | null
}

interface Props {
  value: Supplier | null
  onChange: (supplier: Supplier | null) => void
  error?: string
}

export const SupplierSearch = ({ value, onChange, error }: Props) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [inputValue, setInputValue] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Debounce search term - wait 500ms after user stops typing
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

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleSupplierCreated = (supplier: any) => {
    // Auto-select the newly created supplier
    onChange(supplier)
    setInputValue(supplier.counterparty || '')
  }

  return (
    <>
      <CreateSupplierModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSupplierCreated={handleSupplierCreated}
      />
    <Autocomplete
      value={value}
      onChange={(_, newValue) => {
        onChange(newValue)
      }}
      inputValue={inputValue}
      onInputChange={(_, newInputValue) => {
        setInputValue(newInputValue)
        setSearchTerm(newInputValue)
      }}
      options={options}
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
              {option.name} • {option.type_label}
            </Typography>
          </Box>
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Поставщик"
          placeholder="Введите название поставщика"
          error={Boolean(error)}
          helperText={error}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {isSearching ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
    </>
  )
}
