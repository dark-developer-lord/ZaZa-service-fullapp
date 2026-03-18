import { FoodKey } from '../model/types'

export const getCartQuantityForFood = (
  cartFoods: Record<string, number>,
  foodKey: FoodKey
) => {
  const stableStringify = (obj: any): string => {
    if (Array.isArray(obj)) {
      return JSON.stringify(obj.map(stableStringify))
    } else if (obj !== null && typeof obj === 'object') {
      const sortedKeys = Object.keys(obj).sort()
      const sortedObj: any = {}
      for (const key of sortedKeys) {
        sortedObj[key] = obj[key]
      }
      return JSON.stringify(sortedObj)
    } else {
      return JSON.stringify(obj)
    }
  }

  const key = stableStringify(foodKey)
  return cartFoods[key] ?? 0
}
