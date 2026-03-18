import { useEffect, useState } from 'react'
import { Button, Stack, TextField, useMediaQuery, useTheme } from '@mui/material'
import { useDebounceCallback } from 'usehooks-ts'

import SearchIcon from '@icons/search.svg?react'

interface Props {
  value: string
  onChange: (value: string) => void
  delay?: number
}

export const Search = ({ value, onChange, delay = 500 }: Props) => {
  const [inputValue, setInputValue] = useState('')
  const debounced = useDebounceCallback(onChange, delay)
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
          width: {xs: '100%', mobile: '360px'},
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
      {value !== '' && !isMobile && (
        <Button
          onClick={() => {
            onChange('')
            setInputValue('')
          }}
        >
          Очистить
        </Button>
      )}
    </Stack>
  )
}
