import { useCartStore } from '@features/pos-terminal'
import { getFoodVariation } from '@entities/cart'

export const useGetCartTotal = () => {
  const foods = useCartStore((state) => state.foods)

  const total = foods.reduce(
    (total, { selectedVariations, quantity, basePrice, price, ...food }) => {
      if (food.isNotAvailable) return total

      const variationPrice = (getFoodVariation(food as any, selectedVariations) as any)?.price
      const originalUnitPrice = variationPrice ?? basePrice ?? price

      return total + (originalUnitPrice * quantity)
    },
    0,
  )
  
  // Round to 2 decimal places to avoid floating-point errors
  return Math.round(total * 100) / 100
}
