import { Food } from '@entities/products'

import { SearchCustomer } from '../../customer'
import { AvailableDeliveryMan } from '../../orders'


interface CartBase {
  zoneId: number | null
  restaurantId: number | null
  mainRestaurantId: number | null
  customer: SearchCustomer | null
  address: string
  commentForRestaurant: string | null
  comment: string | null
  delivery: number | null
  deliveryMan: AvailableDeliveryMan | null
}

export interface CartLocalType extends CartBase {
  /** <JSON.stringify(FoodKey), quantity> */
  foods: Record<string, number>
}

export interface CartStoreType extends CartBase {
  foods: FoodCart[]
}

export interface FoodCart extends Food {
  foodKey: string
  selectedVariations: Record<string, string>
  selectedAddons: number[]
  quantity: number
  isNotAvailable: boolean
  /** Derived discount in percent (0..100). Used for UI calculations/back-compat. */
  discount?: number
  /** Raw discount type/value as entered by the user (used for payload). */
  discount_type?: 'percentage' | 'amount'
  /** Raw discount value: percent (0..100) if percentage; somoni if amount. */
  discount_value?: number
  basePrice: number
}

export interface FoodKey {
  foodId: number
  variation: Record<string, string>
  addOns: number[]
}
