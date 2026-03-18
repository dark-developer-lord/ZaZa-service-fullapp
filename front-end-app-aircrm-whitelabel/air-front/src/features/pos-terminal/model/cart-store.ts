import { create } from 'zustand'

import { CartStoreType, FoodCart } from '@entities/cart'
import { SearchCustomer } from '@entities/customer'
import { Food } from '@entities/products'
import { AvailableDeliveryMan } from '@entities/orders'

import { createFoodKey } from '../lib/cart-helpers'
import { CartStorage } from '../lib/cart-storage'

interface State {
  foods: FoodCart[]
  openedActiveFood: boolean
  activeFood: Food | null

  /** Filter */
  zoneId: number | null
  restaurantId: number | null
  mainRestaurantId: number | null
  search: string
  categories: number[]

  /** Customer */
  customer: SearchCustomer | null
  address: string
  commentForRestaurant: string | null
  comment: string | null
  delivery: number | null

  /** Loyalty Points */
  pointsToUse: number

  /**Courier */
  deliveryMan: AvailableDeliveryMan | null

  /** Installment */
  isInstallment: boolean
  initialPayment: number
  debtDueDate: string
  totalPrice: number

  /** Global Discount */
  globalDiscount: number | null
  globalDiscountType: 'percentage' | 'amount'

  /** Payment Methods */
  selectedPaymentMethods: number[] // wallet_ids
  paymentAmounts: Record<number, number> // wallet_id -> amount

  /** Delivery */
  deliveryAddress?: string
}

interface Actions {
  addFood: (
    food: Food,
    selectedVariations: Record<string, string>,
    selectedAddons: number[],
    quantity: number,
  ) => void
  incrementFood: (foodKey: string) => void
  decrementFood: (foodKey: string) => void
  removeFood: (
    foodId: number,
    variation: Record<string, string>,
    addOns: number[],
  ) => void
  removeFoodByKey: (foodKey: string) => void
  /**
   * Sets per-item discount.
   * - discountType = 'percentage': discountValue is percent (0..100)
   * - discountType = 'amount': discountValue is somoni amount for the whole line (basePrice * qty)
   */
  setCustomPrice: (foodKey: string, discountValue: number, discountType?: 'percentage' | 'amount') => void
  clearCart: () => void
  openActiveFood: (food: Food) => void
  removeActiveFood: () => void
  closeActiveFood: () => void
  setCart: (cart: CartStoreType) => void
  removeFoods: () => void

  /** Filter */
  setZoneId: (zoneId: number | null) => void
  setRestaurantId: (restaurantId: number | null) => void
  setMainRestaurantId: (restaurantId: number | null) => void
  setSearch: (search: string) => void
  setCategories: (categories: number[]) => void
  clearFilter: () => void
  clearInfoСlient: () => void

  /** Customer */
  setCustomer: (customer: SearchCustomer | null) => void
  setAddress: (address: string) => void

  /**  Comments */
  setCommentForRestaurant: (comment: string) => void
  setComment: (comment: string) => void
  setDelivery: (delivery: number) => void

  /** Loyalty Points */
  setPointsToUse: (points: number) => void

  /** Courier */
  setDeliveryMan: (delivery: AvailableDeliveryMan | null) => void

  setIsInstallment: (value: boolean) => void
  setInitialPayment: (value: number) => void
  setDebtDueDate: (value: string) => void
  setTotalPrice: (value: number) => void
  setGlobalDiscount: (discount: number | null, type: 'percentage' | 'amount') => void
  clearGlobalDiscount: () => void

  /** Payment Methods Actions */
  setSelectedPaymentMethods: (methods: number[]) => void
  setPaymentAmount: (walletId: number, amount: number) => void
  clearPaymentMethods: () => void

  /** Delivery */
  setDeliveryAddress: (addr: string) => void
}

export const useCartStore = create<State & Actions>((set, getState) => ({
  isInstallment: false,
  initialPayment: 0,
  debtDueDate: '',
  totalPrice: 0,
  globalDiscount: null,
  globalDiscountType: 'percentage',

  selectedPaymentMethods: [],
  paymentAmounts: {},

  zoneId: null,
  mainRestaurantId: null,
  restaurantId: null,
  orderId: null,
  foods: [],
  openedActiveFood: false,
  activeFood: null,
  search: '',
  categories: [],

  customer: null,
  address: '',
  deliveryAddress: '',
  commentForRestaurant: '',
  comment: '',
  delivery: null,

  pointsToUse: 0,

  deliveryMan: null,

  setIsInstallment: (value) => set({ isInstallment: value }),
  setInitialPayment: (value) => set({ initialPayment: value }),
  setDebtDueDate: (value) => set({ debtDueDate: value }),
  setTotalPrice: () => {
    const { foods } = getState()
    const total = foods.reduce((acc, food) => {
      const selectedType = Object.values(food.selectedVariations || {})[0]
      const productPrice = food.retail_price ?? food.price ?? 0
      const variationPrice = (food.variations?.find((v: any) => v.type === selectedType) as any)?.price ?? productPrice
      return acc + variationPrice * food.quantity
    }, 0)
    set({ totalPrice: total })
  },

  setDeliveryAddress: (deliveryAddress) => {
    set({ deliveryAddress })
    ;(CartStorage as any).setDeliveryAddress(deliveryAddress)
  },
  addFood(food, variation, addOns, quantity) {
    const foodKey = createFoodKey({ foodId: food.id, variation, addOns })
    set((state) => {
      const foodList = [...state.foods] // Clone the array to avoid direct state mutation
      const existingFood = foodList.find((food) => food.foodKey === foodKey)

      // Support both old and new API field names
      const productPrice = food.retail_price ?? food.price ?? 0
      let resolvedPrice = productPrice

      // Check if we have new variation structure (ProductVariation[])
      if (food.variations && food.variations.length > 0) {
        const firstVariation = food.variations[0]

        // New variation structure (ProductVariation)
        if ('variation_id' in firstVariation && variation?.variation_id) {
          const matchedVariation = food.variations.find(
            (v: any) => v.variation_id === variation.variation_id
          )
          if (matchedVariation && 'sale_price' in matchedVariation) {
            resolvedPrice = Number(matchedVariation.sale_price)
          }
        }
        // Old variation structure (FoodVariation)
        else if ('type' in firstVariation) {
          const selectedVariationType = Object.values(variation ?? {})[0]
          const matchedVariation = food.variations.find((v: any) => v.type === selectedVariationType)
          if (matchedVariation && 'price' in matchedVariation) {
            resolvedPrice = Number(matchedVariation.price)
          }
        }
      }

      if (existingFood) {
        existingFood.quantity += quantity // Increase quantity if food exists
      } else {
        foodList.push({
          // Add new food item if it doesn't exist
          foodKey,
          ...food,
          selectedVariations: variation,
          selectedAddons: addOns,
          quantity,
          isNotAvailable: false,
          basePrice: resolvedPrice,
          price: resolvedPrice,
          discount: food.discount ?? 0
        })
      }

      return { foods: foodList }
    })
    CartStorage.addFoodToCart(foodKey, quantity)
  },
  removeFood(foodId, variation, addOns) {
    const foodKey = createFoodKey({ foodId, variation, addOns })
    set((state) => {
      return {
        foods: state.foods.filter((food) => food.foodKey !== foodKey),
      }
    })
    CartStorage.removeFoodFromCart(foodKey)
  },
  removeFoodByKey(foodKey) {
    set((state) => {
      return {
        foods: state.foods.filter((food) => food.foodKey !== foodKey),
      }
    })
    CartStorage.removeFoodFromCart(foodKey)
  },
  incrementFood(foodKey) {
    set((state) => {
      const foodList = [...state.foods]
      const existingFood = foodList.find((food) => food.foodKey === foodKey)
      if (existingFood) {
        existingFood.quantity += 1
      }
      return { foods: foodList }
    })
    CartStorage.incrementFoodInCart(foodKey)
  },
  decrementFood(foodKey) {
    set((state) => {
      const foodList = [...state.foods]
      const existingFood = foodList.find((food) => food.foodKey === foodKey)
      if (existingFood) {
        existingFood.quantity -= 1
        if (existingFood.quantity <= 0) {
          return {
            foods: foodList.filter((food) => food.foodKey !== foodKey),
          }
        }
      }
      return { foods: foodList }
    })
    CartStorage.decrementFoodInCart(foodKey)
  },
  setCustomPrice(foodKey, discountValue, discountType = 'percentage') {
    set((state) => {
      const updatedFoods = [...state.foods]
      const food = updatedFoods.find((f) => f.foodKey === foodKey)
      if (food) {
        // Ensure basePrice is set - if not, use current price or reconstruct from variations
        let base = food.basePrice
        if (!base || base === 0) {
          // Try to get from variations
          const productPrice = food.retail_price ?? food.price ?? 0
          base = productPrice
          
          // Check variations if available
          if (food.variations && food.variations.length > 0 && food.selectedVariations) {
            const firstVariation = food.variations[0]
            
            // New variation structure (ProductVariation)
            if ('variation_id' in firstVariation && food.selectedVariations.variation_id) {
              const matchedVariation = food.variations.find((v: any) => v.variation_id === food.selectedVariations.variation_id)
              if (matchedVariation) {
                if ('sale_price' in matchedVariation) {
                  base = Number(matchedVariation.sale_price) ?? 0
                } else if ('price' in matchedVariation) {
                  base = Number(matchedVariation.price) ?? 0
                }
              }
            }
            // Old variation structure (FoodVariation)
            else if ('type' in firstVariation) {
              const variationKeys = Object.values(food.selectedVariations)
              const matchedVariation = food.variations.find((variation: any) => 
                variationKeys.every((key) => variation.type?.includes(key))
              )
              if (matchedVariation && 'price' in matchedVariation) {
                base = Number(matchedVariation.price) ?? 0
              }
            }
          }
          
          // If still 0, try to reconstruct from current price and discount
          if (base === 0 && food.price) {
            if (food.discount && food.discount > 0) {
              base = food.price / (1 - food.discount / 100)
            } else {
              base = food.price
            }
          }
        }
        
        // Ensure base is valid
        if (!base || base === 0) {
          console.warn('setCustomPrice: Could not determine basePrice for food:', food.name, food)
          return { foods: updatedFoods }
        }

        let percent = 0
        let rawValue = 0
        let newPrice: number

        if (discountType === 'percentage') {
          rawValue = Math.min(100, Math.max(0, discountValue || 0))
          percent = rawValue
          newPrice = base * (1 - percent / 100)
        } else {
          // amount mode (somoni): discountValue is per unit, subtract directly from basePrice
          // Example: basePrice=260, discountValue=10 => newPrice=250
          rawValue = Math.min(base, Math.max(0, discountValue || 0))
          newPrice = base - rawValue
          // Calculate percentage for internal tracking (for back-compat)
          percent = base > 0 ? (rawValue / base) * 100 : 0
          percent = Number(percent.toFixed(6))
        }

        // Ensure price doesn't go negative
        newPrice = Math.max(0, newPrice)

        // Always preserve basePrice
        food.basePrice = Math.round(base * 100) / 100 // Round basePrice to avoid floating-point errors
        food.discount_type = discountType
        food.discount_value = Math.round(rawValue * 100) / 100 // Round discount_value to avoid floating-point errors
        food.discount = Math.round(percent * 100) / 100 // Round discount percentage to avoid floating-point errors
        food.price = Math.round(newPrice * 100) / 100 // Round price to avoid floating-point errors
        
        // Debug log for individual product discount
        console.log('Store - setCustomPrice:', {
          foodKey,
          name: food.name,
          discountType,
          discountValue,
          rawValue,
          basePrice: food.basePrice,
          newPrice: food.price,
          discount_type: food.discount_type,
          discount_value: food.discount_value
        })
      }

      // Clear global discount when individual discount is set, but preserve the globalDiscountType
      return {
        foods: updatedFoods,
        globalDiscount: null
        // Don't reset globalDiscountType - preserve it for when user switches back to global discount
      }
    })
  },
  clearCart: () => {
    set({ foods: [], restaurantId: null })
    CartStorage.clearNewOrderCart()
  },
  openActiveFood: (food) => set({ activeFood: food, openedActiveFood: true }),
  removeActiveFood: () => set({ activeFood: null }),
  closeActiveFood: () => set({ openedActiveFood: false }),
  setCart: (cart) => set(cart),
  removeFoods: () => {
    set({ foods: [] })
    CartStorage.clearNewOrderFoods()
  },

  /** Filter */
  setZoneId: (zoneId) => {
    set({ zoneId })
    CartStorage.setZoneId(zoneId)
  },
  setRestaurantId: (restaurantId) => {
    if (restaurantId !== getState().restaurantId && restaurantId !== null) {
      CartStorage.loadChangedRestaurantFoods(
        restaurantId,
        getState().foods,
      ).then((store) => {
        set({ restaurantId, foods: store.foods })
      })
    }
    CartStorage.setRestaurantId(restaurantId)
  },
  setMainRestaurantId: (mainRestaurantId) => {
    set({ mainRestaurantId })
    CartStorage.setMainRestaurantId(mainRestaurantId)
  },
  setSearch: (search) => set({ search }),
  setCategories: (categories) => set({ categories }),
  clearFilter: () => {
    set({
      zoneId: null,
      restaurantId: null,
      mainRestaurantId: null,
      search: '',
      categories: [],
    })
    CartStorage.setZoneId(null)
    CartStorage.setRestaurantId(null)
    CartStorage.setMainRestaurantId(null)
  },

  /** Customer */
  setCustomer: (customer) => {
    set({ customer })
    CartStorage.setCustomer(customer)
  },
  setAddress: (address) => {
    set({ address })
    CartStorage.setAddress(address)
  },
  setCommentForRestaurant: (comment) => {
    set({ commentForRestaurant: comment })
  },
  setComment: (comment) => {
    set({ comment })
  },
  clearInfoСlient: () => {
    set({
      customer: null,
      address: '',
      commentForRestaurant: '',
      comment: '',
      delivery: null,
      deliveryMan: null,
      pointsToUse: 0,
    })
    CartStorage.clearInfoClient()
  },
  setDelivery: (delivery) => {
    set({ delivery })
    CartStorage.setDelivery(delivery)
  },

  setPointsToUse: (points) => {
    set({ pointsToUse: points })
  },

  // courier
  setDeliveryMan: (deliveryMan) => {
    CartStorage.setDeliveryMan(deliveryMan)
    set({ deliveryMan})
  },
  setGlobalDiscount: (discount, type) => {
    (set as any)((state: any) => {
      if (discount !== null && discount > 0) {
        // Apply global discount to all foods
        const updatedFoods = state.foods.map((food: any) => {
          // Always use basePrice if available, otherwise reconstruct it
          // Priority: food.basePrice > matched variation price > food.retail_price > food.price (reconstructed from discount)
          let basePrice = food.basePrice
          if (!basePrice || basePrice === 0) {
            // Try to get price from matched variation first
            if (food.variations && food.variations.length > 0 && food.selectedVariations) {
              const firstVariation = food.variations[0]
              
              // New variation structure (ProductVariation)
              if ('variation_id' in firstVariation && food.selectedVariations.variation_id) {
                const matchedVariation = food.variations.find((v: any) => v.variation_id === food.selectedVariations.variation_id)
                if (matchedVariation) {
                  if ('sale_price' in matchedVariation) {
                    basePrice = Number(matchedVariation.sale_price) ?? 0
                  } else if ('price' in matchedVariation) {
                    basePrice = Number(matchedVariation.price) ?? 0
                  }
                }
              }
              // Old variation structure (FoodVariation)
              else if ('type' in firstVariation) {
                const variationKeys = Object.values(food.selectedVariations)
                const matchedVariation = food.variations.find((variation: any) => 
                  variationKeys.every((key) => variation.type?.includes(key))
                )
                if (matchedVariation && 'price' in matchedVariation) {
                  basePrice = Number(matchedVariation.price) ?? 0
                }
              }
            }
            
            // If still 0, try retail_price (original product price)
            if (basePrice === 0) {
              basePrice = food.retail_price ?? 0
            }
            
            // If still 0, try to reconstruct from current price and discount
            if (basePrice === 0) {
              if (food.discount && food.discount > 0 && food.price) {
                basePrice = food.price / (1 - food.discount / 100)
              } else {
                basePrice = food.price ?? 0
              }
            }
          }
          
          // If basePrice is still 0, we can't apply discount - skip this food
          if (basePrice === 0) {
            console.warn('setGlobalDiscount: basePrice is 0 for food:', food.name, food)
            return food
          }
          
          const qty = food.quantity ?? 1
          const totalLinePriceForThisProduct = basePrice * qty

          let discountPercentage = 0
          let discountValue = 0

          let newPrice: number
          
          if (type === 'percentage') {
            // Global percentage: same % for every product line
            discountPercentage = Math.min(100, Math.max(0, discount))
            discountValue = discountPercentage
            newPrice = basePrice * (1 - discountPercentage / 100)
          } else {
            // Amount mode (сомони): the entered value is subtracted from each product's basePrice
            // Example: discount=10, basePrice=260 => newPrice=250
            // The discount amount is applied per product (per unit), not per line
            const discountAmount = Math.min(basePrice, Math.max(0, discount))
            discountValue = discountAmount
            // Directly subtract discount from basePrice
            newPrice = basePrice - discountAmount
            // Calculate percentage for internal tracking
            discountPercentage = basePrice > 0
              ? (discountAmount / basePrice) * 100
              : 0
          }
          
          // Ensure price doesn't go negative
          newPrice = Math.max(0, newPrice)

          const updatedFood = {
            ...food,
            basePrice: Math.round(basePrice * 100) / 100, // Round basePrice to avoid floating-point errors
            discount_type: type === 'percentage' ? 'percentage' : 'amount',
            discount_value: Math.round(discountValue * 100) / 100, // Round discount_value to avoid floating-point errors
            // Keep derived percent for UI calculations/back-compat
            discount: Math.round(Math.min(100, Math.max(0, discountPercentage)) * 100) / 100, // Round discount percentage
            price: Math.round(newPrice * 100) / 100 // Round price to avoid floating-point errors
          }
          
          // Debug: Log first food item
          if (state.foods.indexOf(food) === 0) {
            console.log('Store - setGlobalDiscount:', {
              name: updatedFood.name,
              type,
              discount,
              basePrice: updatedFood.basePrice,
              discount_type: updatedFood.discount_type,
              discount_value: updatedFood.discount_value,
              newPrice: updatedFood.price,
              oldPrice: food.price
            })
          }
          
          return updatedFood
        })

        return {
          foods: updatedFoods,
          globalDiscount: discount,
          globalDiscountType: type
        }
      } else {
        // Clear global discount
        const updatedFoods = state.foods.map((food: any) => ({
          ...food,
          discount_type: undefined,
          discount_value: undefined,
          discount: 0
        }))

        return {
          foods: updatedFoods,
          globalDiscount: null,
          globalDiscountType: type
        }
      }
    })
  },
  clearGlobalDiscount: () => {
    set((state) => {
      const updatedFoods = state.foods.map(food => ({
        ...food,
        discount_type: undefined,
        discount_value: undefined,
        discount: 0
      }))

      return {
        foods: updatedFoods as any,
        globalDiscount: null,
        // keep currently selected type; clearing value should not force UI back to percentage
        globalDiscountType: state.globalDiscountType
      }
    })
  },

  setSelectedPaymentMethods: (methods) => set({ selectedPaymentMethods: methods }),
  setPaymentAmount: (walletId, amount) => {
    const { paymentAmounts } = getState()
    set({
      paymentAmounts: {
        ...paymentAmounts,
        [walletId]: amount
      }
    })
  },
  clearPaymentMethods: () => set({ selectedPaymentMethods: [], paymentAmounts: {} })
}))
