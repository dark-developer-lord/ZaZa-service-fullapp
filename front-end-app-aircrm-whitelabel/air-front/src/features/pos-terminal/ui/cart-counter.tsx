import { Box, IconButton, SxProps, useTheme } from '@mui/material'
import { useQuery } from 'react-query'

import { FoodCart } from '@entities/cart'
import PlusIcon from '@icons/plus.svg?react'
import SubtractIcon from '@icons/subtract-fill.svg?react'

import { useCartStore } from '../model/cart-store'
import { getFoodsByIds } from '../api/get-foods-by-ids'
interface Props {
  food: FoodCart
}

export const CartCounter = ({ food }: Props) => {
  const { palette } = useTheme()
  const [increment, decrement] = useCartStore((state) => [
    state.incrementFood,
    state.decrementFood,
  ])

  const buttonStyles: SxProps = {
    bgcolor: 'grey.100',
    borderRadius: '12px',
    '& .MuiTouchRipple-child': {
      backgroundColor: `${palette.text.primary} !important`,
    },
    '&:disabled': {
      opacity: 0.7,
    },
    '& > svg': {
      stroke: `${palette.text.primary} !important`,
    },
  }

  // Fetch the original food data to get the stock quantity
  const { data: originalFoodData } = useQuery({
    queryKey: ['food-stock', food.id],
    queryFn: () => getFoodsByIds([food.id]),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    cacheTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  })

  const cartJson = localStorage.getItem('cart') ?? '{}'
  const cart = JSON.parse(cartJson)
  const cartFoods = cart.foods ?? {}

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

  const originalFood = originalFoodData?.data.find(f => f.id === food.id)
  const originalStockQuantity = (originalFood as any)?.quantity || 0

  const maxBuyable = Math.max(originalStockQuantity - totalInCartQty, 0)

  // Check if incrementing this cart item would exceed the total available stock
  const isAtMax = originalStockQuantity > 0 ? (totalInCartQty + 1) > originalStockQuantity : food.quantity >= 100

  return (
    <Box
      sx={{
        borderRadius: '12px',
        border: '1px solid',
        borderColor: 'primary.main',
        display: 'flex',
        width: 'fit-content',
        overflow: 'hidden',
      }}
    >
      <IconButton
        size="small"
        color="secondary"
        sx={buttonStyles}
        disabled={food.quantity <= 1}
        onClick={() => decrement(food.foodKey)}
      >
        <SubtractIcon
          width={16}
          height={16}
          stroke={palette.text.primary}
        />
      </IconButton>
      <Box
        sx={{
          minWidth: 32,
          height: 32,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '13px',
          fontWeight: 700,
          lineHeight: '20px',
          bgcolor: 'white',
        }}
      >
        {food.quantity}
      </Box>
      <IconButton
        size="small"
        color="secondary"
        sx={buttonStyles}
        onClick={() => increment(food.foodKey)}
        disabled={isAtMax}
      >
        <PlusIcon
          width={16}
          height={16}
          stroke={palette.text.primary}
        />
      </IconButton>
    </Box>
  )
}
