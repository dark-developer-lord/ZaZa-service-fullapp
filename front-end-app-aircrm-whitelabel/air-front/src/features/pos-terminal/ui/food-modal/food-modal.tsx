import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  styled,
  Typography,
} from '@mui/material'

import { getFoodPrice, getFoodVariation } from '@entities/cart'
import CloseIcon from '@icons/close.svg?react'

import { useCartStore } from '../../model/cart-store'
import { FoodAddons } from './food-addons'
import { Counter } from './food-counter'
import { FoodOptions } from './food-options'

export const FoodModal = () => {
  const [quantity, setQuantity] = useState<number>(1)
  const [selectedVariations, setSelectedVariations] = useState<
    Record<string, string>
  >({})
  const [selectedAddons, setSelectedAddons] = useState<number[]>([])
  const [isOpen, food, close, remove, addToCart] = useCartStore((state) => [
    state.openedActiveFood,
    state.activeFood,
    state.closeActiveFood,
    state.removeActiveFood,
    state.addFood,
  ])

  useEffect(() => {
    if (food) {
      setSelectedVariations(
        food.choice_options?.reduce(
          (acc, option) => {
            acc[option.name] = option.options[0]
            return acc
          },
          {} as Record<string, string>,
        ) || {},
      )

      // Set initial quantity based on available stock
      // We'll set it to 1 initially, and the useEffect below will adjust if needed
      setQuantity(1)
    }
  }, [food])

  // Update quantity when variations or addons change to respect maxBuyable
  useEffect(() => {
    if (food) {
      const maxBuyable = getMaxBuyable()

      // If current quantity exceeds maxBuyable, clamp it
      setQuantity(prev => {
        if (prev > maxBuyable) {
          return Math.max(Math.min(prev, maxBuyable), 0)
        }
        return prev
      })
    }
  }, [selectedVariations, selectedAddons, food])

  // Helper function to calculate available stock
  const getMaxBuyable = () => {
    if (!food) return 0
    const cartJson = localStorage.getItem('cart') ?? '{}'
    const cart = JSON.parse(cartJson)
    const cartFoods = cart.foods ?? {}

    // Check if we have new variation structure (ProductVariation[])
    if (food.variations && food.variations.length > 0) {
      const firstVariation = food.variations[0]

      // New variation structure (ProductVariation) - each variation has its own quantity
      if ('variation_id' in firstVariation && selectedVariations.variation_id) {
        const selectedVariation = food.variations.find(
          (v: any) => v.variation_id === selectedVariations.variation_id
        )

        if (selectedVariation && 'quantity' in selectedVariation) {
          // Calculate quantity of THIS SPECIFIC variation in cart
          let variationInCartQty = 0
          Object.keys(cartFoods).forEach(foodKeyStr => {
            try {
              const parsedFoodKey = JSON.parse(foodKeyStr)
              // Check if this cart item is the same food ID AND same variation
              if (parsedFoodKey.foodId === food.id &&
                  parsedFoodKey.variation?.variation_id === selectedVariations.variation_id) {
                variationInCartQty += cartFoods[foodKeyStr]
              }
            } catch (error) {
              // Skip invalid JSON keys
            }
          })

          const availableQuantity = Number(selectedVariation.quantity)
          return Math.max(availableQuantity - variationInCartQty, 0)
        }

        // If no variation is selected yet, return 0
        return 0
      }
    }

    // Old logic for products without variations or old variation structure
    // Calculate total quantity of ALL variations of this food item in cart
    let totalInCartQty = 0
    Object.keys(cartFoods).forEach(foodKeyStr => {
      try {
        const parsedFoodKey = JSON.parse(foodKeyStr)
        // If this cart item is the same food ID (regardless of variations/addons)
        if (parsedFoodKey.foodId === food.id) {
          totalInCartQty += cartFoods[foodKeyStr]
        }
      } catch (error) {
        // Skip invalid JSON keys
      }
    })

    // Convert quantity to number (handles both string and number types)
    const availableQuantity = typeof food.quantity === 'string' ? parseFloat(food.quantity) : (food.quantity ?? 0)
    return Math.max(availableQuantity - totalInCartQty, 0)
  }

  const increment = () => {
    if (!food) return
    const maxBuyable = getMaxBuyable()

    // Only increment if we haven't reached the maximum available quantity
    if (quantity < maxBuyable) {
      setQuantity((prev) => prev + 1)
    }
  }

  const onManualChange = (value: number) => {
    if (!food) return
    const maxBuyable = getMaxBuyable()

    // Only allow values within the available stock range
    if (value > 0 && value <= maxBuyable) {
      setQuantity(value)
    }
  }
  const decrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : prev))

  const onClose = () => {
    close()
    setTimeout(() => {
      remove()
      setQuantity(1)
      setSelectedVariations({})
      setSelectedAddons([])
    }, 100)
  }

  if (!food) {
    return null
  }

  // Support both old and new API response structures
  const productName = food.product_name || food.name || ''
  const productPrice = food.retail_price ?? food.price ?? 0
  const productImage = food.image || '/placeholder-image.png'

  const toCart = () => {
    const maxBuyable = getMaxBuyable()

    // Clamp the quantity to not exceed available stock
    const actualQuantityToAdd = Math.min(quantity, maxBuyable)

    // Only add to cart if there's something to add
    if (actualQuantityToAdd > 0) {
      addToCart(food, selectedVariations, selectedAddons, actualQuantityToAdd)
    }

    onClose()
  }

  const maxBuyable = getMaxBuyable()

  // Check if product has variations and if a variation is selected
  const hasVariations = food.variations && food.variations.length > 0
  const hasNewVariations = hasVariations && food.variations && food.variations.length > 0 && 'variation_id' in food.variations[0]
  const isVariationSelected = hasNewVariations ? Boolean(selectedVariations.variation_id) : true

  // Disable button if: no stock OR (has variations but none selected)
  const isButtonDisabled = maxBuyable === 0 || (hasNewVariations && !isVariationSelected)

  return (
    <Dialog
      open={isOpen}
      onClose={(event, reason) => {
        if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
          return
        }
        onClose()
      }}
      PaperProps={{
        sx: {
          position: 'relative',
        },
      }}
      sx={{
        '& .MuiDialog-paper': {
          mx: 2,
          minWidth: {
            xs: 0,
            mobile: 480,
          },
          width: {
            xs: '100%',
            mobile: 450
          },
          '@media (max-width: 480px)': {
            maxWidth: 'calc(100% - 32px) !important'
          },
        }
      }}
      scroll="body"
    >
      <IconButton
        onClick={onClose}
        sx={{
          position: 'absolute',
          top: 12,
          right: 20,
        }}
      >
        <CloseIcon
          width={24}
          height={24}
        />
      </IconButton>
      <DialogContent>
        <Box sx={{ width: '100%', height: 232 }}>
          <Image
            src={productImage}
            alt={productName}
          />
        </Box>
        <Divider sx={{ mb: 2 }} />
        <DialogTitle sx={{ padding: 0, mb: '4px' }}>{productName}</DialogTitle>
        {hasNewVariations && !isVariationSelected ? (
          <Typography
            variant="medium"
            color="text.tertiary"
            component="p"
            mb="20px"
            fontStyle="italic"
          >
            Выберите один из вариантов ниже
          </Typography>
        ) : (
          <Typography
            variant="medium"
            color="text.secondary"
            component="p"
            mb="20px"
          >
            {getFoodPrice(food, selectedVariations, selectedAddons, quantity)}{' '}
            сомони{' '}
            <Typography
              color="text.tertiary"
              component="span"
              variant="medium"
            >
              (1 шт /{' '}
              {(getFoodVariation(food, selectedVariations) as any)?.price || productPrice}{' '}
              сомони)
            </Typography>
          </Typography>
        )}
        <Typography
          variant="medium"
          color="text.secondary"
          component="p"
          mb="20px"
        >
          Максимум можно купить: {maxBuyable}
        </Typography>
        <Typography
          variant="medium"
          color="text.secondary"
          component="p"
          mb="20px"
        >
          Нет описания к товару
        </Typography>
        <FoodOptions
          food={food}
          selectedVariations={selectedVariations}
          setSelectedVariations={setSelectedVariations}
        />
        {/* {food.add_ons.length > 0 && (
          <FoodAddons
            food={food}
            selectedAddons={selectedAddons}
            setSelectedAddons={setSelectedAddons}
          />
        )} */}
        <Stack
          direction="row"
          spacing="16px"
          mt="24px"
        >
          <Counter
            quantity={quantity}
            onDecrement={decrement}
            onIncrement={increment}
            maxQuantity={maxBuyable}
            onManualChange={onManualChange}
          />
          <Button
            fullWidth
            onClick={toCart}
            disabled={isButtonDisabled}
          >
            В корзину
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}

const Image = styled('img')`
  width: 100%;
  height: 100%;
  object-fit: contain;
`
