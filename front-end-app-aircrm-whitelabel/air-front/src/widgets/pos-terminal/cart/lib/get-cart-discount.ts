import { useCartStore } from '@features/pos-terminal'
import { getFoodVariation } from '@entities/cart'

export const useGetCartDiscount = () => {
  const foods = useCartStore((state) => state.foods)

  const totalDiscount = foods.reduce(
    (totalDiscount, { selectedVariations, quantity, discount, discount_type, discount_value, basePrice, price, ...food }) => {
      if (food.isNotAvailable) return totalDiscount
      
      // If no discount, skip
      if (!discount && (!discount_value || discount_value === 0)) return totalDiscount
      
      const variationPrice = (getFoodVariation(food as any, selectedVariations) as any)?.price
      const originalUnitPrice = variationPrice ?? basePrice ?? price
      
      let itemTotalDiscount = 0
      
      if (discount_type === 'amount' && discount_value !== undefined && discount_value > 0) {
        // Amount mode: discount_value is per unit, multiply by quantity
        itemTotalDiscount = discount_value * quantity
      } else if (discount && discount > 0) {
        // Percentage mode: calculate from percentage
        const discountPerUnit = originalUnitPrice * (discount / 100)
        itemTotalDiscount = discountPerUnit * quantity
      }
      
      return totalDiscount + itemTotalDiscount
    },
    0,
  )
  
  // Round to 2 decimal places to avoid floating-point errors
  return Math.round(totalDiscount * 100) / 100
}
