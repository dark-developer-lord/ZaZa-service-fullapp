import { IconButton, lighten, Stack, useTheme, InputBase } from '@mui/material'

import AddIcon from '@icons/add-fill.svg?react'
import SubtractIcon from '@icons/subtract-fill.svg?react'
import { useEffect, useState } from 'react'
interface CounterProps {
  quantity: number
  maxQuantity: number
  onIncrement: () => void
  onDecrement: () => void
  onManualChange: (value: number) => void
}

export const Counter = ({
  quantity,
  maxQuantity,
  onDecrement,
  onIncrement,
  onManualChange,
}: CounterProps) => {
  const [inputValue, setInputValue] = useState(String(quantity))
  
  useEffect(() => {
    setInputValue(String(quantity))
  }, [quantity])
  const { palette } = useTheme()
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="left"
      width={160}
      sx={{
        width: 160,
        flexShrink: 0,
        overflow: 'hidden',
      }}
      border={1}
      borderRadius={'12px'}
      borderColor={'primary.main'}
    >
      <IconButton
        sx={{
          bgcolor: 'grey.100',
          borderRadius: '12px',
          '&:disabled': {
            bgcolor: 'grey.100',
          },
          '&:hover': {
            bgcolor: lighten(palette.primary.main, 0.8),
          },
        }}
        onClick={onDecrement}
        disabled={quantity <= 1}
      >
        <SubtractIcon
          width={24}
          height={24}
          fill={palette.primary.main}
        />
      </IconButton>
      <InputBase
        type="text"
        value={inputValue}
        onFocus={(e) => e.target.select()}
        onChange={(e) => {
          let value = e.target.value.replace(',', '.')

          // Allow only numeric input with optional one dot
          if (/^\d*\.?\d*$/.test(value)) {
            setInputValue(value)
          }
        }}
        onBlur={() => {
          const parsed = parseFloat(inputValue)
          if (!isNaN(parsed) && parsed > 0) {
            const clamped = Math.min(parsed, maxQuantity)
            onManualChange(clamped)
          } else {
            onManualChange(1)
          }
        }}
        inputProps={{
          style: {
            textAlign: 'center',
            fontSize: 20,
            width: 60,
            backgroundColor: 'white',
          },
          inputMode: 'decimal',
          pattern: '[0-9,.]*',
        }}
      />
      <IconButton
        sx={{
          marginLeft: 'auto',
          bgcolor: 'grey.100',
          borderRadius: '12px',
          '&:hover': {
            bgcolor: lighten(palette.primary.main, 0.8),
          },
        }}
        onClick={onIncrement}
        disabled={quantity >= maxQuantity}
      >
        <AddIcon
          width={24}
          height={24}
          fill={palette.primary.main}
        />
      </IconButton>
    </Stack>
  )
}
