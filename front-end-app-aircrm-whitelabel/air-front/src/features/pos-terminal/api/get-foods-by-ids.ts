import { Food } from '@entities/products'
import { Api, api, getApiPaths } from '@shared/api'

export const getFoodsByIds = async (ids: number[]) => {
  const response = await api.get<{ data: Food[] }>(
    getApiPaths().getFoodsByIds_ + `?food_ids=${ids.join(',')}`,
  )
  return response.data
}

export const getFoodsByNames = async (
  restaurantId: number,
  names: string[],
) => {
  const search = names.map((name) => `food_names[]=${name}`).join('&')
  const response = await api.get<{ data: Food[] }>(
    Api.restaurantFoodsByNames_ + restaurantId + `?${search}`,
  )
  return response.data
}
