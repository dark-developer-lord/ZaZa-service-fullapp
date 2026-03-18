import { FC, useEffect, useState, useRef } from 'react'
import {
  Box,
  IconButton,
  styled,
  Typography,
  useTheme,
  TextField,
  useMediaQuery,
  Chip
} from '@mui/material'

import CloseIcon from '@icons/close.svg?react'

import { getFoodVariation } from '../lib/get-food-price'
import { FoodCart } from '../model/types'

interface Props {
  food: FoodCart
  Counter?: FC<{ food: FoodCart }>
  removeFood?: () => void
  setCustomPrice?: (foodKey: string, discountValue: number, discountType?: 'percentage' | 'amount') => void
  globalDiscountActive?: boolean
  /** When global discount is active, force each item UI to show this type. */
  globalDiscountType?: 'percentage' | 'amount'
}

export const Card = ({ food, Counter, removeFood, setCustomPrice, globalDiscountActive = false, globalDiscountType }: Props) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [discountType, setDiscountType] = useState<'percentage' | 'amount'>(food.discount_type ?? 'percentage')
  // Local state for discount input to allow free typing
  const [discountInputValue, setDiscountInputValue] = useState<string>('')
  // Track previous discountType to only sync when it actually changes
  const previousDiscountTypeRef = useRef<'percentage' | 'amount'>(discountType)
  const previousGlobalDiscountActiveRef = useRef<boolean>(globalDiscountActive)

  // Keep the per-item toggle in sync with global discount type (and with food.discount_type updates from store)
  useEffect(() => {
    // Only use globalDiscountType when global discount is actually active
    if (globalDiscountActive && globalDiscountType) {
      setDiscountType(globalDiscountType)
      return
    }
    // Otherwise, use the food's own discount_type
    if (food.discount_type) {
      setDiscountType(food.discount_type)
    } else {
      // Default to percentage if no type is set
      setDiscountType('percentage')
    }
  }, [globalDiscountActive, globalDiscountType, food.discount_type])

  // Initial sync on mount
  useEffect(() => {
    if (globalDiscountActive) {
      if (food.discount_value !== undefined && food.discount_value > 0) {
        setDiscountInputValue(
          globalDiscountType === 'amount'
            ? Math.round(food.discount_value).toString()
            : food.discount_value.toString()
        )
      }
    } else {
      if (food.discount_value !== undefined && food.discount_value > 0) {
        if (food.discount_type === 'amount') {
          setDiscountInputValue(Math.round(food.discount_value).toString())
        } else {
          setDiscountInputValue(food.discount_value.toString())
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only on mount

  // Sync discount input value ONLY when discount type actually changes or global discount is toggled
  useEffect(() => {
    // Only sync if discountType actually changed or globalDiscountActive toggled
    const typeChanged = previousDiscountTypeRef.current !== discountType
    const globalToggled = previousGlobalDiscountActiveRef.current !== globalDiscountActive
    
    if (typeChanged || globalToggled) {
      previousDiscountTypeRef.current = discountType
      previousGlobalDiscountActiveRef.current = globalDiscountActive
      
      if (globalDiscountActive) {
        // When global discount is active, show the global discount value
        if (food.discount_value !== undefined && food.discount_value > 0) {
          setDiscountInputValue(
            globalDiscountType === 'amount'
              ? Math.round(food.discount_value).toString()
              : food.discount_value.toString()
          )
        } else {
          setDiscountInputValue('')
        }
      } else {
        // When no global discount, sync with per-item discount
        if (food.discount_value !== undefined && food.discount_value > 0) {
          if (food.discount_type === 'amount') {
            setDiscountInputValue(Math.round(food.discount_value).toString())
          } else {
            setDiscountInputValue(food.discount_value.toString())
          }
        } else {
          setDiscountInputValue('')
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [discountType, globalDiscountActive, globalDiscountType]) // Only sync when type changes, NOT when discount_value changes

  // Get matched variation for new structure
  const matchedVariation = getFoodVariation(food, food.selectedVariations)

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    
    // Allow empty string for free typing
    if (value === '') {
      setDiscountInputValue('')
      if (setCustomPrice) {
        setCustomPrice(food.foodKey, 0, discountType)
      }
      return
    }
    
    // Only allow numeric input
    if (/^\d*\.?\d*$/.test(value)) {
      setDiscountInputValue(value) // Update local state immediately for responsive typing
      let numericValue = parseFloat(value) || 0

      if (discountType === 'percentage') {
        // Percentage mode: limit to 0-100%
        numericValue = Math.min(100, Math.max(0, numericValue))
        if (setCustomPrice) {
          setCustomPrice(food.foodKey, numericValue, 'percentage')
        }
      } else {
        // Amount mode: discount is per unit (сомони), not per line
        // Get base price from matched variation or fallback
        let basePrice = food.basePrice ?? food.price ?? 0
        if (matchedVariation) {
          if ('sale_price' in matchedVariation) {
            basePrice = Number(matchedVariation.sale_price)
          } else if ('price' in matchedVariation) {
            basePrice = Number(matchedVariation.price)
          }
        }

        // Limit amount to not exceed base price per unit (not total line)
        numericValue = Math.min(basePrice, Math.max(0, numericValue))

        if (setCustomPrice) {
          setCustomPrice(food.foodKey, numericValue, 'amount')
        }
      }
    }
  }

  // Support both old and new API response structures
  const productName = food.product_name || food.name || ''
  const productPrice = food.retail_price ?? food.price ?? 0
  const productImage = food.image || '/placeholder-image.png'

  // Calculate base price from matched variation or fallback
  // Always prefer food.basePrice if it exists (set by store), otherwise calculate from variation
  let basePrice = food.basePrice
  if (!basePrice || basePrice === 0) {
    basePrice = productPrice
    if (matchedVariation) {
      if ('sale_price' in matchedVariation) {
        basePrice = Number(matchedVariation.sale_price)
      } else if ('price' in matchedVariation) {
        basePrice = Number(matchedVariation.price)
      }
    }
  }

  const currentDiscount = food.discount ?? 0
  
  // Debug: Log values when global discount is active
  if (globalDiscountActive) {
    console.log('Card - discount calculation:', {
      name: food.name,
      basePrice,
      food_basePrice: food.basePrice,
      discount_type: food.discount_type,
      discount_value: food.discount_value,
      currentDiscount,
      globalDiscountType
    })
  }
  
  // Calculate discounted price based on discount type
  let discountedPrice: number
  if (food.discount_type === 'amount' && food.discount_value !== undefined && food.discount_value > 0) {
    // Amount mode (сомони): subtract discount amount directly from basePrice
    discountedPrice = basePrice - food.discount_value
    console.log('Card - Amount mode calculation:', {
      name: food.name,
      basePrice,
      discount_type: food.discount_type,
      discount_value: food.discount_value,
      discountedPrice,
      food_price: food.price
    })
  } else if (food.discount_type === 'amount' && (!food.discount_value || food.discount_value === 0)) {
    // Amount mode but no discount value - show base price
    discountedPrice = basePrice
  } else {
    // Percentage mode: use percentage calculation
    discountedPrice = basePrice * (1 - currentDiscount / 100)
  }
  
  // Ensure price doesn't go negative and round to avoid floating-point errors
  discountedPrice = Math.max(0, discountedPrice)
  discountedPrice = Math.round(discountedPrice * 100) / 100
  
  // Format price to show decimals only when needed (e.g., 254.5 instead of 255, but 255 instead of 255.00)
  const formatPrice = (price: number): string => {
    const rounded = Math.round(price * 100) / 100
    // If it's a whole number, show without decimals
    if (Math.abs(rounded % 1) < 0.001) {
      return Math.round(rounded).toString()
    }
    // Show up to 2 decimal places, removing trailing zeros
    const formatted = rounded.toFixed(2)
    // Remove trailing zeros and decimal point if not needed
    return formatted.replace(/\.?0+$/, '')
  }
  
  return (
    <Box sx={{ position: 'relative', py: '12px' }}>
      <Box sx={{ display: 'flex', gap: '12px' }}>
        {/* Left: Image */}
        <Box sx={{ flexShrink: 0 }}>
          <Image
            src={productImage}
            alt={productName}
            width={112}
            height={112}
          />
        </Box>

        {/* Center: Product Info */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {/* Product Name - Bigger Header */}
          <Typography
            variant="h6"
            sx={{
              mb: '8px',
              fontWeight: 600,
              fontSize: isMobile ? '16px' : '18px',
              lineHeight: 1.2
            }}
          >
            {productName}
          </Typography>

          {/* Price Section */}
          <Box sx={{ mb: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Typography
              variant="small"
              sx={{ color: 'text.secondary' }}
            >
              Цена
            </Typography>
            {currentDiscount > 0 && (
              <Typography
                variant="body1"
                sx={{
                  textDecoration: 'line-through',
                  color: 'text.secondary',
                  fontWeight: 500
                }}
              >
                {basePrice}
              </Typography>
            )}
            <Typography
              variant="body1"
              sx={{
                fontWeight: 700,
                color: 'text.primary',
                fontSize: '16px'
              }}
            >
              {formatPrice(discountedPrice)}
            </Typography>
            <Typography
              variant="small"
              sx={{ color: 'text.secondary' }}
            >
              {isMobile ? 'с.' : 'сомони'}
            </Typography>
          </Box>

          {/* Discount Section */}
          <Box sx={{ mb: '8px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', mb: '4px' }}>
              <Typography
                variant="small"
                sx={{ color: 'text.secondary' }}
              >
                Скидка
              </Typography>
              <TextField
                value={discountInputValue}
                onChange={handleDiscountChange}
                disabled={globalDiscountActive}
                size="small"
                sx={{
                  width: '60px',
                  '& .MuiInputBase-root': {
                    borderRadius: '8px',
                    height: '32px',
                    bgcolor: globalDiscountActive ? 'grey.200' : 'white'
                  },
                  '& .MuiInputBase-input': {
                    padding: '6px 8px',
                    textAlign: 'center'
                  }
                }}
              />
            </Box>

            {/* Discount Type Switcher */}
            <Box sx={{ display: 'flex', gap: '4px' }}>
              <Chip
                label="сомони"
                size="small"
                variant={discountType === 'amount' ? 'filled' : 'outlined'}
                color={discountType === 'amount' ? 'primary' : 'default'}
                disabled={globalDiscountActive}
                onClick={() => {
                  setDiscountType('amount')
                  // Update store immediately when type changes, but only if there's a value
                  if (setCustomPrice && discountInputValue) {
                    const currentValue = parseFloat(discountInputValue) || 0
                    if (currentValue > 0) {
                      setCustomPrice(food.foodKey, currentValue, 'amount')
                    }
                  }
                }}
                sx={{
                  height: '24px',
                  fontSize: '11px',
                  cursor: globalDiscountActive ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  transitionDelay: '0ms',
                  '&:hover': {
                    backgroundColor: globalDiscountActive
                      ? 'grey.200'
                      : discountType === 'amount' ? 'primary.main' : 'grey.100',
                    transition: 'background-color 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    transitionDelay: '30ms'
                  }
                }}
              />
              <Chip
                label="%"
                size="small"
                variant={discountType === 'percentage' ? 'filled' : 'outlined'}
                color={discountType === 'percentage' ? 'primary' : 'default'}
                disabled={globalDiscountActive}
                onClick={() => {
                  setDiscountType('percentage')
                  // Update store immediately when type changes, but only if there's a value
                  if (setCustomPrice && discountInputValue) {
                    const currentValue = parseFloat(discountInputValue) || 0
                    if (currentValue > 0) {
                      setCustomPrice(food.foodKey, currentValue, 'percentage')
                    }
                  }
                }}
                sx={{
                  height: '24px',
                  fontSize: '11px',
                  cursor: globalDiscountActive ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  transitionDelay: '0ms',
                  '&:hover': {
                    backgroundColor: globalDiscountActive
                      ? 'grey.200'
                      : discountType === 'percentage' ? 'primary.main' : 'grey.100',
                    transition: 'background-color 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    transitionDelay: '30ms'
                  }
                }}
              />
            </Box>
          </Box>

          {/* Attribute Section */}
          {Object.entries(food.selectedVariations).length > 0 && (
            <Box sx={{ mb: '8px' }}>
              {/* New variation structure - show variation_type and attribute_value */}
              {matchedVariation && 'variation_type' in matchedVariation ? (
                <>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', mb: '4px' }}>
                    <Typography
                      variant="small"
                      sx={{ color: 'text.secondary' }}
                    >
                      Вариация:
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: 'text.primary'
                      }}
                    >
                      {matchedVariation.variation_type}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Typography
                      variant="small"
                      sx={{ color: 'text.secondary' }}
                    >
                      Аттрибут:
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: 'text.primary'
                      }}
                    >
                      {matchedVariation.attribute_value}
                    </Typography>
                  </Box>
                </>
              ) : (
                /* Old variation structure - show as before */
                Object.entries(food.selectedVariations).map(
                  ([key, value], index) => (
                    <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: '8px', mb: index < Object.entries(food.selectedVariations).length - 1 ? '4px' : 0 }}>
                      <Typography
                        variant="small"
                        sx={{ color: 'text.secondary' }}
                      >
                        Аттрибут
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: 'text.primary'
                        }}
                      >
                        {value}
                      </Typography>
                      <Typography
                        variant="small"
                        sx={{ color: 'text.secondary' }}
                      >
                        {food.choice_options?.find((option) => option.name === key)?.title}
                      </Typography>
                    </Box>
                  ),
                )
              )}
            </Box>
          )}

          {food.isNotAvailable && (
            <Typography
              variant="subtitle2"
              sx={{ color: 'error.main', mt: '8px' }}
            >
              Блюдо не доступно в этом ресторане
            </Typography>
          )}
        </Box>

        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          minWidth: 'fit-content'
        }}>
          <IconButton
            size="small"
            onClick={removeFood}
          >
            <CloseIcon
              width={20}
              height={20}
              stroke={theme.palette.text.secondary}
            />
          </IconButton>
        </Box>
      </Box>

      {/* Counter positioned below content, aligned to right */}
      {Counter && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            mt: '12px',
            pointerEvents: food.isNotAvailable ? 'none' : 'auto',
          }}
        >
          <Counter food={food} />
        </Box>
      )}
    </Box>
  )
}

const Image = styled('img')`
  width: 112px;
  height: 112px;
  object-fit: cover;
  border-radius: 8px;
`
