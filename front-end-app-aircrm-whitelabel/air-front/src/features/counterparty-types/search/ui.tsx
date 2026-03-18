import { useEffect, useState } from 'react'
import { Button, Stack, TextField } from '@mui/material'
import { useDebounceCallback } from 'usehooks-ts'

import SearchIcon from '@icons/search.svg?react'

interface Props {
  value: string
  onChange: (value: string) => void
}

export const Ui = ({ value, onChange }: Props) => {
  const [inputValue, setInputValue] = useState('')
  const debounced = useDebounceCallback(onChange, 300)

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
          width: 360,
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
      {value !== '' && (
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

