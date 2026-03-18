import { useEffect, useState } from 'react'
import { IconButton, TextField } from '@mui/material'
import { useDebounceCallback } from 'usehooks-ts'

import SearchIcon from '@icons/search.svg?react'
import CloseIcon from '@icons/close.svg?react'

import { useCartStore } from '../model/cart-store'

export const Search = () => {
  const [searchValue, setSearchValue] = useState('')
  const [value, setValue, restaurantId, zoneId] = useCartStore((state) => [
    state.search,
    state.setSearch,
    state.restaurantId,
    state.zoneId,
  ])
  const debounced = useDebounceCallback(setValue, 300)

  useEffect(() => {
    setValue('')
    setSearchValue('')
  }, [restaurantId, setValue, setSearchValue])

  useEffect(() => {
    if (value === '') {
      setSearchValue('')
    }
  }, [value])

  return (
    <TextField
      variant="outlined"
      value={searchValue}
      fullWidth
      onChange={(event) => {
        setSearchValue(event.target.value)
        debounced(event.target.value)
      }}
      disabled={restaurantId === null}
      InputProps={{
        startAdornment: (
          <SearchIcon
            width={20}
            height={20}
            stroke="#9A9DA3"
          />
        ),
        endAdornment: value !== '' && (
          <IconButton
            size="small"
            onClick={() => {
              setValue('')
              setSearchValue('')
            }}
            sx={{ mr: 1 }}
          >
            <CloseIcon
              width={16}
              height={16}
              stroke="#9A9DA3"
            />
          </IconButton>
        ),
      }}
      placeholder="Поиск"
    />
  )
}
