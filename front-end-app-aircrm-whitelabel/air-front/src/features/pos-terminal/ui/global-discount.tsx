import { useEffect, useState, useRef } from 'react'
import {
  Box,
  Typography,
  TextField,
  Chip,
  useTheme
} from '@mui/material'

import { useCartStore } from '../model/cart-store'

export const GlobalDiscount = () => {
  const theme = useTheme()
  const [
    globalDiscount,
    globalDiscountType,
    setGlobalDiscount,
    clearGlobalDiscount,
    foods
  ] = useCartStore((state) => [
    state.globalDiscount,
    state.globalDiscountType,
    state.setGlobalDiscount,
    state.clearGlobalDiscount,
    state.foods
  ])

  const [discountType, setDiscountType] = useState<'percentage' | 'amount'>('percentage')
  // Local input state to allow free typing without being blocked by store updates
  const [inputValue, setInputValue] = useState<string>('')
  const previousDiscountTypeRef = useRef<'percentage' | 'amount'>(globalDiscountType)

  // Keep local toggle in sync with store (store is the source of truth)
  useEffect(() => {
    setDiscountType(globalDiscountType)
  }, [globalDiscountType])

  // Sync input value with store ONLY when type toggle changes (not during typing)
  useEffect(() => {
    // Only sync if discountType actually changed (user clicked toggle)
    if (previousDiscountTypeRef.current !== discountType) {
      previousDiscountTypeRef.current = discountType
      
      // Get current store values at the time of type change
      const currentDiscount = globalDiscount
      const currentType = globalDiscountType
      
      if (currentDiscount !== null && currentDiscount > 0) {
        if (discountType === 'percentage') {
          setInputValue(currentType === 'percentage' 
            ? currentDiscount.toString() 
            : ((currentDiscount / foods.length)).toFixed(1))
        } else {
          setInputValue(currentType === 'amount'
            ? currentDiscount.toString()
            : (currentDiscount * foods.length).toFixed(0))
        }
      } else {
        setInputValue('')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [discountType]) // Only when discountType changes (toggle clicked)

  // Check if any individual product has discount set
  const hasIndividualDiscounts = foods.some(food => (food.discount ?? 0) > 0)

  // Check if global discount is active
  const hasGlobalDiscount = globalDiscount !== null && globalDiscount > 0

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    
    // Allow empty string for free typing
    if (value === '') {
      setInputValue('')
      setGlobalDiscount(null, discountType)
      return
    }
    
    // Only allow numeric input
    if (/^\d*\.?\d*$/.test(value)) {
      setInputValue(value) // Update local state immediately for responsive typing
      const numericValue = parseFloat(value) || 0
      
      if (numericValue === 0) {
        // Clear value but keep the currently selected type
        setGlobalDiscount(null, discountType)
      } else {
        if (discountType === 'percentage') {
          const limitedValue = Math.min(100, Math.max(0, numericValue))
          setGlobalDiscount(limitedValue, 'percentage')
        } else {
          // For amount mode, just send the raw value (store will clamp per line)
          const positiveValue = Math.max(0, numericValue)
          setGlobalDiscount(positiveValue, 'amount')
        }
      }
    }
  }

  const handleDiscountTypeChange = (newType: 'percentage' | 'amount') => {
    setDiscountType(newType)
    if (hasGlobalDiscount) {
      // Convert current discount to new type
      if (newType === 'amount' && globalDiscountType === 'percentage') {
        // Convert percentage to equal amount distribution
        const totalProducts = foods.length
        const amountValue = globalDiscount! * totalProducts // Equal distribution
        setGlobalDiscount(amountValue, 'amount')
      } else if (newType === 'percentage' && globalDiscountType === 'amount') {
        // Convert equal amount back to percentage (use average)
        const totalProducts = foods.length
        const amountPerProduct = globalDiscount! / totalProducts
        const avgPrice = foods.reduce((sum, food) => sum + (food.basePrice ?? food.price), 0) / totalProducts
        const percentageValue = avgPrice > 0 ? (amountPerProduct / avgPrice) * 100 : 0
        setGlobalDiscount(percentageValue, 'percentage')
      }
    } else {
      // No active global discount yet, but we still want the store (and product cards) to follow the selected type
      // This sets globalDiscountType in store without applying any discount value.
      setGlobalDiscount(null, newType)
    }
  }

  // Don't show if cart is empty
  if (foods.length === 0) return null

  return (
    <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Общая скидка
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <TextField
            value={inputValue}
            onChange={handleDiscountChange}
            size="small"
            disabled={hasIndividualDiscounts && !hasGlobalDiscount}
            placeholder="0"
            sx={{
              flex: 1, // Take remaining space
              '& .MuiInputBase-root': {
                borderRadius: '8px',
                height: '40px',
                bgcolor: hasIndividualDiscounts && !hasGlobalDiscount ? 'grey.200' : 'white'
              },
              '& .MuiInputBase-input': {
                padding: '8px 12px',
                textAlign: 'center'
              }
            }}
          />

          {/* Discount Type Switcher - moved inline */}
          <Chip
            label="сомони"
            size="small"
            variant={discountType === 'amount' ? 'filled' : 'outlined'}
            color={discountType === 'amount' ? 'primary' : 'default'}
            disabled={hasIndividualDiscounts && !hasGlobalDiscount}
            onClick={() => handleDiscountTypeChange('amount')}
            sx={{
              height: '40px', // Match TextField height
              fontSize: '12px',
              cursor: hasIndividualDiscounts && !hasGlobalDiscount ? 'not-allowed' : 'pointer',
              '&:hover': {
                backgroundColor: hasIndividualDiscounts && !hasGlobalDiscount
                  ? 'grey.200'
                  : discountType === 'amount' ? 'primary.main' : 'grey.100'
              }
            }}
          />
          <Chip
            label="%"
            size="small"
            variant={discountType === 'percentage' ? 'filled' : 'outlined'}
            color={discountType === 'percentage' ? 'primary' : 'default'}
            disabled={hasIndividualDiscounts && !hasGlobalDiscount}
            onClick={() => handleDiscountTypeChange('percentage')}
            sx={{
              height: '40px', // Match TextField height
              fontSize: '12px',
              cursor: hasIndividualDiscounts && !hasGlobalDiscount ? 'not-allowed' : 'pointer',
              '&:hover': {
                backgroundColor: hasIndividualDiscounts && !hasGlobalDiscount
                  ? 'grey.200'
                  : discountType === 'percentage' ? 'primary.main' : 'grey.100'
              }
            }}
          />
        </Box>
      </Box>

      {hasIndividualDiscounts && !hasGlobalDiscount && (
        <Typography variant="caption" color="text.secondary">
          Отключено: установлены индивидуальные скидки на товары
        </Typography>
      )}
      
      {hasGlobalDiscount && (
        <Typography variant="caption" color="primary.main">
          Применена общая скидка ко всем товарам
        </Typography>
      )}
    </Box>
  )
}
