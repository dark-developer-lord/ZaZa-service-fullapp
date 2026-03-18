import { useEffect, useState } from 'react'
import { Button, Stack, TextField, useMediaQuery, useTheme } from '@mui/material'
import { useDebounceCallback } from 'usehooks-ts'

import SearchIcon from '@icons/search.svg?react'

import { useStore } from '../model/store'

export const Search = () => {
  const [inputValue, setInputValue] = useState('')
  const { searchValue, search, clear } = useStore((state) => ({
    searchValue: state.searchValue,
    search: state.search,
    clear: state.clear,
  }))
  const debounced = useDebounceCallback(search, 300)

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('mobile'))

  useEffect(() => {
    debounced(inputValue)
  }, [inputValue, debounced])

  return (
    <Stack
      direction="row"
      columnGap={2}
    >
      <TextField
        variant="outlined"
        sx={{
          width: {xs: '100%', mobile: '360px'}
        }}
        value={inputValue}
        onChange={(event) => {
          setInputValue(event.target.value)
        }}
        InputProps={{
          startAdornment: (
            <SearchIcon
              width={20}
              height={20}
              stroke="#9A9DA3"
            />
          ),
        }}
        placeholder="Поиск"
        size="small"
      />
      {searchValue !== '' && !isMobile && (
        <Button
          onClick={() => {
            clear()
            setInputValue('')
          }}
        >
          Очистить
        </Button>
      )}
    </Stack>
  )
}
