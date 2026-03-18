import { FoodCart } from '@entities/cart/model/types'
import { Food } from '@entities/products'

export const getFoodVariation = (
  food: Food,
  selectedVariations: Record<string, string>,
) => {
  if (!food.variations || food.variations.length === 0) {
    return undefined
  }

  const firstVariation = food.variations[0]

  // New variation structure (ProductVariation)
  if ('variation_id' in firstVariation && selectedVariations.variation_id) {
    const variation = food.variations.find((v: any) => v.variation_id === selectedVariations.variation_id)
    // Return with normalized price field for backward compatibility
    if (variation && 'sale_price' in variation) {
      return {
        ...variation,
        price: (variation as any).sale_price // Add price field for backward compatibility
      }
    }
    return variation
  }

  // Old variation structure (FoodVariation)
  const variationKeys = Object.values(selectedVariations)
  return food.variations.find((variation: any) => {
    return variationKeys.every((key) => variation.type?.includes(key))
  })
}

export const getFoodPrice = (
  food: Food | FoodCart,
  selectedVariations: Record<string, string>,
  selectedAddons: number[],
  quantity: number
) => {
  const matchedVariation = getFoodVariation(food, selectedVariations)

  // Support both old and new API field names
  const productPrice = food.retail_price ?? food.price ?? 0

  let basePrice = productPrice

  // Check if we have a matched variation
  if (matchedVariation) {
    // New variation structure (ProductVariation)
    if ('sale_price' in matchedVariation) {
      basePrice = Number(matchedVariation.sale_price)
    }
    // Old variation structure (FoodVariation)
    else if ('price' in matchedVariation) {
      basePrice = Number(matchedVariation.price)
    }
  }
  // If no variation matched but food is FoodCart, use basePrice
  else if ('basePrice' in food) {
    basePrice = food.basePrice
  }

  const discount = food.discount ?? 0

  const discountedUnitPrice = basePrice * (1 - discount / 100)
  return discountedUnitPrice * quantity
}
