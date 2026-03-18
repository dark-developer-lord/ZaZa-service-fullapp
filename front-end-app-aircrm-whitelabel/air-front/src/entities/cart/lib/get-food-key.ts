import { FoodKey } from '../model/types'

export const getFoodKey = (
  foodId: number,
  variation: Record<string, string>,
  addOns: number[]
): FoodKey => ({
  foodId,
  variation,
  addOns,
})