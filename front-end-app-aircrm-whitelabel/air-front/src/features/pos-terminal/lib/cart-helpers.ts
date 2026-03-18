import { FoodKey } from '@entities/cart'
import { sortObjectKeys } from '@shared/lib'

interface Props {
  foodId: number
  variation: Record<string, string>
  addOns: number[]
}
export const createFoodKey = ({ foodId, variation, addOns }: Props) => {
  const key: FoodKey = {
    foodId,
    variation: sortObjectKeys(variation),
    addOns: addOns.sort((a, b) => a - b),
  }
  return JSON.stringify(
    sortObjectKeys(key as unknown as Record<string, unknown>),
  )
}

export const parseFoodKey = (key: string) => {
  return JSON.parse(key) as FoodKey
}
