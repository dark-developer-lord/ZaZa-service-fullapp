import toast from 'react-hot-toast'

import { CartLocalType, CartStoreType, FoodCart, FoodKey } from '@entities/cart'
import { SearchCustomer } from '@entities/customer'
import { AvailableDeliveryMan } from '@entities/orders'

import { getFoodsByIds, getFoodsByNames } from '../api/get-foods-by-ids'
import { createFoodKey } from './cart-helpers'

export class CartStorage {
  static init() {
    if (!localStorage.getItem('cart')) {
      const cart: CartLocalType = {
        zoneId: null,
        restaurantId: null,
        mainRestaurantId: null,
        foods: {},
        customer: null,
        address: '',
        commentForRestaurant: '',
        comment: '',
        delivery: 0,
        deliveryMan: null,
      }
      localStorage.setItem('cart', JSON.stringify(cart))
    }
  }

  static get getCart(): CartLocalType {
    if (!localStorage.getItem('cart')) {
      this.init()
    }
    return JSON.parse(localStorage.getItem('cart')!)
  }

  static get getNewOrderCartFoods() {
    return this.getCart.foods
  }

  static get getNewOrderInfo(): Omit<CartLocalType, 'edit'> {
    const cart = this.getCart
    return {
      ...cart,
      foods: this.getNewOrderCartFoods,
    }
  }

  static async loadChangedRestaurantFoods(
    restaurantId: number,
    foods: FoodCart[],
  ) {
    const newOrderInfo = this.getCart
    const cartStore: CartStoreType = {
      ...newOrderInfo,
      foods: [],
    }

    if (
      foods.length === 0 ||
      !cartStore.mainRestaurantId ||
      !restaurantId ||
      !cartStore.zoneId
    ) {
      return cartStore
    }
    try {
      const response = await getFoodsByNames(
        restaurantId,
        foods.map((food) => food.product_name || food.name || '').filter(Boolean),
      )
      cartStore.foods = foods.map((food) => {
        const foodName = food.product_name || food.name
        const findFood = response.data.find(({ name, product_name }) =>
          (product_name || name) === foodName
        )
        let isNotAvailable = !findFood
        if (
          findFood &&
          !isNotAvailable &&
          Object.keys(food.selectedVariations).length > 0
        ) {
          isNotAvailable = findFood.choice_options?.some((option) => {
            return !option.options.includes(
              food.selectedVariations[option.name],
            )
          }) ?? false
        }
        if (findFood && !isNotAvailable && food.selectedAddons.length > 0) {
          isNotAvailable = findFood.add_ons?.some(
            (addOn) => !food.selectedAddons.includes(addOn.id),
          ) ?? false
        }
        return {
          ...food,
          isNotAvailable,
        }
      })
    } catch (error) {
      if (typeof error === 'string') {
        toast.error(error)
      } else {
        toast.error('Произошла ошибка при загрузки похожих товаров')
      }
    }
    return cartStore
  }

  static async loadNewOrderCart(): Promise<CartStoreType> {
    const newOrderInfo = this.getNewOrderInfo
    const cartStore: CartStoreType = {
      ...newOrderInfo,
      foods: [],
    }
    const foodIds = this.newOrderFoodIds
    if (
      foodIds.length === 0 ||
      !newOrderInfo.restaurantId
    ) {
      return cartStore
    }
    try {
      const response = await getFoodsByIds(foodIds)
      cartStore.foods = Object.keys(newOrderInfo.foods).map((foodKey) => {
        const localFood: FoodKey = JSON.parse(foodKey)
        const food = response.data.find((food) => food.id === localFood.foodId)

        const discount = food?.discount ?? 0
        const productPrice = food?.retail_price ?? food?.price ?? 0
        const basePrice = productPrice
        const discountedPrice = Math.round(basePrice * (1 - discount / 100))

        return {
          ...food!,
          foodKey,
          selectedVariations: localFood.variation,
          selectedAddons: localFood.addOns,
          quantity: newOrderInfo.foods[foodKey],
          isNotAvailable: false,
          basePrice: basePrice,
          price: discountedPrice,
          discount: discount,
          discount_type: 'percentage',
          discount_value: discount
        }
      })
    } catch (error) {
      toast.error('Произошла ошибка при загрузке корзины')
    }
    if (
      cartStore.foods.length > 0 &&
      (cartStore.foods[0] as any).restaurant_id !== newOrderInfo.restaurantId
    ) {
      const store = await CartStorage.loadChangedRestaurantFoods(
        newOrderInfo.restaurantId,
        cartStore.foods,
      )
      if (store.foods.length > 0) {
        cartStore.foods = store.foods
      }
    }
    return cartStore
  }

  private static get newOrderFoodIds() {
    const newOrderCart = this.getNewOrderCartFoods
    const productIds = Object.keys(newOrderCart).map(
      (key) => JSON.parse(key).foodId,
    )
    return [...new Set(productIds)]
  }

  static setOrderInfo(
    zoneId: number,
    restaurantId: number,
    mainRestaurantId: number,
    orderId?: number,
  ) {
    if (!orderId) {
      const cart = this.getCart
      cart.zoneId = zoneId
      cart.mainRestaurantId = mainRestaurantId
      cart.restaurantId = restaurantId
      this.setCart(cart)
    }
    //   TODO: for edit orders
  }

  static setOrderFoods(
    restaurantId: number,
    mainRestaurantId: number,
    zoneId: number,
    foods: CartStoreType['foods'],
  ) {
    const cart = this.getCart
    cart.restaurantId = restaurantId
    cart.mainRestaurantId = mainRestaurantId
    cart.zoneId = zoneId
    cart.foods = {}
    foods.forEach((food) => {
      const foodKey = createFoodKey({
        foodId: food.id,
        variation: food.selectedVariations,
        addOns: food.selectedAddons,
      })
      cart.foods[foodKey] = food.quantity
    })
    this.setCart(cart)
  }

  static clearNewOrderInfo() {
    const cart = this.getCart
    cart.zoneId = null
    cart.restaurantId = null
    cart.mainRestaurantId = null
    this.setCart(cart)
  }

  static addFoodToCart(foodKey: string, quantity: number) {
    const cart = this.getCart
    if (cart.foods[foodKey]) {
      cart.foods[foodKey] += quantity
    } else {
      cart.foods[foodKey] = quantity
    }
    this.setCart(cart)
  }

  static incrementFoodInCart(foodKey: string) {
    const cart = this.getCart
    cart.foods[foodKey] += 1
    this.setCart(cart)
  }

  static decrementFoodInCart(foodKey: string) {
    const cart = this.getCart
    cart.foods[foodKey] -= 1
    if (cart.foods[foodKey] <= 0) {
      delete cart.foods[foodKey]
    }
    this.setCart(cart)
  }

  static removeFoodFromCart(foodKey: string) {
    const cart = this.getCart
    delete cart.foods[foodKey]
    this.setCart(cart)
  }

  static setCart(cart: CartLocalType) {
    localStorage.setItem('cart', JSON.stringify(cart))
  }

  static clearNewOrderCart() {
    const cart = this.getCart
    cart.foods = {}
    cart.zoneId = null
    cart.restaurantId = null
    cart.mainRestaurantId = null
    cart.deliveryMan = null
    this.setCart(cart)
  }

  static clearNewOrderFoods() {
    const cart = this.getCart
    cart.foods = {}
    this.setCart(cart)
  }

  static setZoneId(zoneId: number | null) {
    const cart = this.getCart
    cart.zoneId = zoneId
    this.setCart(cart)
  }

  static setRestaurantId(restaurantId: number | null) {
    const cart = this.getCart
    cart.restaurantId = restaurantId
    this.setCart(cart)
  }

  static setMainRestaurantId(mainRestaurantId: number | null) {
    const cart = this.getCart
    cart.mainRestaurantId = mainRestaurantId
    this.setCart(cart)
  }

  static setCustomer(customer: SearchCustomer | null) {
    const cart = this.getCart
    cart.customer = customer
    this.setCart(cart)
  }

  static setAddress(address: string) {
    const cart = this.getCart
    cart.address = address
    this.setCart(cart)
  }

  static setCommentForRestaurant(comment: string) {
    const cart = this.getCart
    cart.commentForRestaurant = comment
    this.setCart(cart)
  }

  static setComment(comment: string) {
    const cart = this.getCart
    cart.comment = comment
    this.setCart(cart)
  }

  static setDelivery(delivery: number | null) {
    const cart = this.getCart
    cart.delivery = delivery
    this.setCart(cart)
  }

  static setDeliveryMan(courier: AvailableDeliveryMan | null) {
    const cart = this.getCart
    cart.deliveryMan = courier
    this.setCart(cart)
  }

  static clearInfoClient() {
    const cart = this.getCart
    cart.customer = null
    cart.address = ''
    cart.commentForRestaurant = ''
    cart.comment = ''
    cart.delivery = null
    cart.deliveryMan = null
    this.setCart(cart)
  }
}
