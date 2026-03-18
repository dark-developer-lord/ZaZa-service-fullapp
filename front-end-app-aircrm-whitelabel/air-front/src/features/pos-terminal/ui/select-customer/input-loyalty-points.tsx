import { useState, useEffect, useRef } from 'react'
import { Box, TextField } from '@mui/material'

import { useCartStore } from '../../model/cart-store'

export const InputLoyaltyPoints = () => {
  const customer = useCartStore((state) => state.customer)
  const pointsToUse = useCartStore((state) => state.pointsToUse)
  const setPointsToUse = useCartStore((state) => state.setPointsToUse)

  const [inputValue, setInputValue] = useState('')
  const previousCustomerIdRef = useRef<number | null>(null)

  const availablePoints = customer?.loyalty_point || 0

  useEffect(() => {
    setInputValue(pointsToUse.toString())
  }, [pointsToUse])

  useEffect(() => {
    // Reset points when customer changes or is removed
    const currentCustomerId = customer?.id ?? null

    if (currentCustomerId !== previousCustomerIdRef.current) {
      setPointsToUse(0)
      setInputValue('')
      previousCustomerIdRef.current = currentCustomerId
    }
  }, [customer, setPointsToUse])

  const handlePointsChange = (value: string) => {
    setInputValue(value)
    
    if (value === '') {
      setPointsToUse(0)
      return
    }

    const numericValue = Number(value)
    
    if (isNaN(numericValue) || numericValue < 0) {
      return
    }

    // Cannot exceed available points
    const pointsToSet = Math.min(numericValue, availablePoints)
    setPointsToUse(pointsToSet)
    
    // Update input if value was capped
    if (pointsToSet !== numericValue) {
      setInputValue(pointsToSet.toString())
    }
  }

  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
      <TextField
        label="Списать баллы"
        value={inputValue}
        onChange={(e) => handlePointsChange(e.target.value)}
        size="small"
        sx={{ flex: 1 }}
        type="number"
        inputProps={{
          min: 0,
          max: availablePoints,
        }}
        helperText={
          !customer
            ? 'Выберите клиента для использования баллов'
            : availablePoints > 0
              ? `Максимум: ${availablePoints}`
              : 'У клиента нет баллов'
        }
        disabled={!customer || availablePoints === 0}
      />

      <TextField
        label="Доступно"
        value={customer ? availablePoints : 'Н/Д'}
        disabled
        size="small"
        sx={{ flex: 1 }}
        InputProps={{
          readOnly: true,
        }}
      />
    </Box>
  )
}
