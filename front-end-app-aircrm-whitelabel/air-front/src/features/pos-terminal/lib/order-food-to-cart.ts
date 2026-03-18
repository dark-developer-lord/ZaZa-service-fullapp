import { useEffect } from 'react'

import { FoodCart } from '@entities/cart'
import { useGetOrder } from '@entities/orders'

import { getFoodsByIds } from '../api/get-foods-by-ids'
import { useCartStore } from '../model/cart-store'
import { createFoodKey } from './cart-helpers'

export const useOrderFoodToCart = () => {
  const { data: order } = useGetOrder()
  const [setCart, foods] = useCartStore((state) => [state.setCart, state.foods])

  useEffect(() => {
    if (order && foods.length === 0) { // Only load foods if cart is empty
      getFoodsByIds(order.data.products.map((product) => product.details.id)).then(
        (products) => {
          const cartFoods = order.data.products.map((product) => {
            const foodDetails = products.data.find(
              ({ id }) => id === product.details.id,
            )
            const selectedVariations: Record<string, string> = {}
            product.variation && (product.variation as any).forEach((variation: any) => {

              foodDetails?.choice_options?.forEach((option) => {
                const selectedOption = option.options.find((value) =>
                  variation.includes(value),
                )
                if (selectedOption) {
                  selectedVariations[option.name] = selectedOption
                }
              })
            })
            
            const foodKey = createFoodKey({
              foodId: foodDetails?.id || 0,
              variation: selectedVariations,
              addOns: [],
            })
            return {
              id: foodDetails?.id || 0,
              quantity: product.quantity,
              price: product.price,
              name: foodDetails?.name || '',
              variations: foodDetails?.variations || [],
              image: foodDetails?.image || '',
              choice_options: foodDetails?.choice_options || [],
              add_ons: foodDetails?.add_ons || [],
              foodKey,
              selectedVariations,
              isNotAvailable: false,
              restaurant_id: (foodDetails as any)?.restaurant_id || 0,
              discount: (product as any).discount,
              basePrice: foodDetails?.price || product.details.price,
            }
          }) as unknown as FoodCart[]
          // Get current cart state to preserve customer/address data
          const currentState = useCartStore.getState()
          setCart({
            ...currentState,
            restaurantId: order.data.warehouse.id,
            foods: cartFoods,
            // Preserve existing customer and address if already set, otherwise use order data
            address: currentState.address || order.data.delivery_address?.road || '',
            customer: currentState.customer || {
              id: order.data.customer.id,
              name: order.data.customer.f_name || '',
              phone: order.data.customer.phone,
              addresses: [],
              loyalty_point: 0,
              default_address: order.data.delivery_address?.road || '',
            },
            commentForRestaurant: order.data.comment_for_restaurant,
            comment: order.data.comment,
            delivery: order.data.delivery_charge,
            deliveryMan: order.data.delivery_man,
            zoneId: null,
            mainRestaurantId: null
          })
        },
      )
    }
  }, [order, setCart, foods.length])
}
