import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Box,
  Typography,
  Button,
  Stack,
  FormControl,
  FormLabel,
  Divider,
  Checkbox,
  TextField,
} from '@mui/material'
import CloseIcon from '@icons/close.svg?react'
import { Food, ProductVariation } from '@entities/finance/model/food'
import { normalizeNumber } from '@shared/lib'

interface VariationSelection {
  variation: ProductVariation
  quantity: string
  selected: boolean
  stockQuantity: number // Original warehouse stock quantity
}

interface Props {
  open: boolean
  onClose: () => void
  product: Food | null
  onConfirm: (selections: Array<{ product: Food, quantity: number, selectedVariation: ProductVariation | null }>) => void
}

const isProductVariations = (variations: any[]): variations is ProductVariation[] => {
  return variations.length > 0 && 'variation_id' in variations[0]
}

export const ProductSelectionModal = ({ open, onClose, product, onConfirm }: Props) => {
  const [quantity, setQuantity] = useState<string>('1')
  const [variationSelections, setVariationSelections] = useState<VariationSelection[]>([])

  useEffect(() => {
    if (product) {
      setQuantity('1')
      // Initialize variation selections if product has variations
      if (product.variations && product.variations.length > 0 && isProductVariations(product.variations)) {
        const selections = (product.variations as ProductVariation[]).map(variation => {
          console.log('[Modal Init] variation.quantity (stock):', variation.quantity)
          return {
            variation,
            quantity: '1',
            selected: false,
            // Store stock quantity separately to ensure it's never overwritten
            stockQuantity: variation.quantity,
          }
        })
        setVariationSelections(selections)
      } else {
        setVariationSelections([])
      }
    }
  }, [product])

  if (!product) return null

  const productName = product.product_name || product.name || ''
  const productImage = product.image || '/placeholder-image.png'
  const hasVariations = product.variations && product.variations.length > 0 && isProductVariations(product.variations)

  // Get max available quantity for non-variation products
  const maxQuantity = typeof product.quantity === 'string' ? parseFloat(product.quantity) : product.quantity

  // Get current price for non-variation products
  const currentPrice = product.retail_price ?? product.price ?? 0

  const handleConfirm = () => {
    if (hasVariations) {
      // Add all selected variations as an array
      const selectedVariations = variationSelections
        .filter(vs => vs.selected && vs.quantity !== '' && parseFloat(vs.quantity) > 0)
        .map(vs => {
          console.log('[Modal Confirm] vs.quantity:', vs.quantity, 'vs.stockQuantity:', vs.stockQuantity, 'vs.variation.quantity:', vs.variation.quantity)
          return {
            product,
            quantity: parseFloat(vs.quantity),
            // Pass stockQuantity explicitly to avoid any mutation issues
            selectedVariation: { ...vs.variation, stockQuantity: vs.stockQuantity }
          }
        })
      onConfirm(selectedVariations)
    } else {
      // Add product without variation
      const numQuantity = parseFloat(quantity) || 0
      onConfirm([{ product, quantity: numQuantity, selectedVariation: null }])
    }
    onClose()
  }

  // Helper function to validate and handle quantity input
  const handleQuantityInputChange = (value: string): string => {
    // Replace comma with dot
    let sanitized = value.replace(',', '.')

    // Allow empty value
    if (sanitized === '') return ''

    // Allow only valid positive decimal numbers
    // This regex allows: digits, one optional dot, and digits after dot
    if (/^\d*\.?\d*$/.test(sanitized)) {
      return sanitized
    }

    return ''
  }

  const handleVariationToggle = (index: number) => {
    setVariationSelections(prev =>
      prev.map((vs, i) =>
        i === index ? { ...vs, selected: !vs.selected } : vs
      )
    )
  }

  const handleVariationQuantityChange = (index: number, value: string) => {
    const sanitized = handleQuantityInputChange(value)

    // Only update if input is valid or empty
    if (sanitized !== '' || value === '') {
      setVariationSelections(prev =>
        prev.map((vs, i) =>
          i === index ? { ...vs, quantity: sanitized } : vs
        )
      )
    }
  }

  // Validate quantity on blur - clamp to max if needed
  const handleVariationQuantityBlur = (index: number) => {
    const maxQty = variationSelections[index].variation.quantity
    const currentValue = variationSelections[index].quantity
    const numValue = parseFloat(currentValue)

    if (!isNaN(numValue) && numValue > maxQty) {
      setVariationSelections(prev =>
        prev.map((vs, i) =>
          i === index ? { ...vs, quantity: maxQty.toString() } : vs
        )
      )
    }
  }

  // Check if the confirm button should be disabled
  const isConfirmDisabled = () => {
    if (hasVariations) {
      // For variations: need at least one selected with valid quantity
      return !variationSelections.some(vs =>
        vs.selected && vs.quantity !== '' && parseFloat(vs.quantity) > 0
      )
    } else {
      // For non-variation products: need valid quantity and stock available
      const numQuantity = parseFloat(quantity)
      return maxQuantity <= 0 || quantity === '' || isNaN(numQuantity) || numQuantity <= 0
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <IconButton
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          zIndex: 1,
        }}
      >
        <CloseIcon width={24} height={24} />
      </IconButton>
      
      <DialogContent>
        <Box sx={{ width: '100%', height: 232, mb: 2 }}>
          <img
            src={productImage}
            alt={productName}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: 8,
            }}
          />
        </Box>
        
        <Divider sx={{ mb: 2 }} />
        
        <DialogTitle sx={{ padding: 0, mb: '4px' }}>{productName}</DialogTitle>

        {!hasVariations && (
          <>
            <Typography variant="medium" color="text.secondary" component="p" mb="20px">
              {normalizeNumber(currentPrice * (parseFloat(quantity) || 0))} сомони
              <Typography color="text.tertiary" component="span" variant="medium">
                {' '}(1 шт / {normalizeNumber(currentPrice)} с.)
              </Typography>
            </Typography>

            <Typography variant="medium" color="text.secondary" component="p" mb="20px">
              Доступно: {normalizeNumber(maxQuantity)}
            </Typography>
          </>
        )}

        {/* Variation Selection */}
        {hasVariations && (
          <FormControl fullWidth sx={{ mb: 3 }}>
            <FormLabel
              id="product-variations"
              sx={{ fontWeight: 600, color: 'text.primary', mb: 2 }}
            >
              Выберите вариации
            </FormLabel>
            <Stack spacing={2}>
              {variationSelections.map((vs, index) => {
                const isOutOfStock = vs.variation.quantity <= 0
                return (
                  <Box
                    key={vs.variation.variation_id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      p: 2,
                      border: '1px solid',
                      borderColor: vs.selected ? 'primary.main' : 'divider',
                      borderRadius: 1,
                      backgroundColor: vs.selected ? 'action.selected' : 'transparent',
                      opacity: isOutOfStock ? 0.5 : 1,
                    }}
                  >
                    <Checkbox
                      checked={vs.selected}
                      onChange={() => handleVariationToggle(index)}
                      disabled={isOutOfStock}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body1" fontWeight={600}>
                        {vs.variation.variation_type}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {normalizeNumber(vs.variation.sale_price)} сомони
                        {isOutOfStock && ' (Нет в наличии)'}
                        {!isOutOfStock && ` • В наличии: ${vs.variation.quantity}`}
                      </Typography>
                    </Box>
                    {vs.selected && (
                      <TextField
                        type="text"
                        size="small"
                        value={vs.quantity}
                        onChange={(e) => handleVariationQuantityChange(index, e.target.value)}
                        onBlur={() => handleVariationQuantityBlur(index)}
                        onKeyDown={(e) => {
                          const invalidKeys = ['e', 'E', '+', '-', 'ArrowUp', 'ArrowDown']
                          if (invalidKeys.includes(e.key)) {
                            e.preventDefault()
                          }
                        }}
                        inputProps={{
                          inputMode: 'decimal',
                          pattern: '[0-9]*[.,]?[0-9]*',
                        }}
                        sx={{
                          width: 100,
                          '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                            WebkitAppearance: 'none',
                            margin: 0,
                          },
                          '& input[type=number]': {
                            MozAppearance: 'textfield',
                          },
                        }}
                        disabled={isOutOfStock}
                        helperText={`Макс: ${vs.variation.quantity}`}
                      />
                    )}
                  </Box>
                )
              })}
            </Stack>
          </FormControl>
        )}

        <Stack direction="row" spacing="16px" mt="24px">
          {!hasVariations && (
            <TextField
              type="text"
              size="small"
              label="Количество"
              value={quantity}
              onChange={(e) => {
                const sanitized = handleQuantityInputChange(e.target.value)
                if (sanitized !== '' || e.target.value === '') {
                  setQuantity(sanitized)
                }
              }}
              onBlur={() => {
                const numValue = parseFloat(quantity)
                if (!isNaN(numValue) && numValue > maxQuantity) {
                  setQuantity(maxQuantity.toString())
                }
              }}
              onKeyDown={(e) => {
                const invalidKeys = ['e', 'E', '+', '-', 'ArrowUp', 'ArrowDown']
                if (invalidKeys.includes(e.key)) {
                  e.preventDefault()
                }
              }}
              inputProps={{
                inputMode: 'decimal',
                pattern: '[0-9]*[.,]?[0-9]*',
              }}
              sx={{
                width: 160,
                flexShrink: 0,
                '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                  WebkitAppearance: 'none',
                  margin: 0,
                },
                '& input[type=number]': {
                  MozAppearance: 'textfield',
                },
              }}
              helperText={`Макс: ${normalizeNumber(maxQuantity)}`}
            />
          )}
          <Button
            fullWidth
            onClick={handleConfirm}
            disabled={isConfirmDisabled()}
          >
            Добавить
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}

