import { Button } from '@mui/material'

import { Food } from '@entities/products'

import { useCartStore } from '../model/cart-store'

interface Props {
  food: Food
}

export const AddToCart = ({ food }: Props) => {
  const openActiveFood = useCartStore((state) => state.openActiveFood)

  return (
    <Button
      size="small"
      fullWidth
      onClick={() => {
        openActiveFood(food)
      }}
    >
      В корзину
    </Button>
  )
}
