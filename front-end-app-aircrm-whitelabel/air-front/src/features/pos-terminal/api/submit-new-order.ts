import toast from 'react-hot-toast'
import { useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { useTheme, useMediaQuery } from '@mui/material'
import { useGetLoginSource } from '@shared/auth'
import { AxiosError } from 'axios'

import { getFoodVariation } from '@entities/cart'
import { ApiKeys, getApiPaths, postQuery, queryClient } from '@shared/api'
import { RouterPaths } from '@shared/lib'

import { useOrdersFilterStore } from '../../orders'
import { useCartStore } from '../model/cart-store'

// Helper function to round numbers to 2 decimal places, avoiding floating-point errors
const roundToTwoDecimals = (value: number | null | undefined): number => {
  if (value === null || value === undefined) return 0
  return Math.round(value * 100) / 100
}

interface Props {
  customerId?: number
  deliveryAddress?: string
  customerAddressId?: number
  commentRestaurant: string
  comment: string
}

export const useSubmitNewOrder = ({
  customerId,
  deliveryAddress,
  customerAddressId,
  commentRestaurant,
  comment,
}: Props) => {
  const [
    restaurantId,
    foods,
    clearCart,
    clearInfoСlient,
    delivery,
    deliveryMan,
    isInstallment,
    initialPayment,
    debtDueDate,
    totalPrice,
    address,
    pointsToUse,
    selectedPaymentMethods,
    paymentAmounts,
  ] = useCartStore((state) => [
    state.restaurantId,
    state.foods,
    state.clearCart,
    state.clearInfoСlient,
    state.delivery,
    state.deliveryMan,
    state.isInstallment,
    state.initialPayment,
    state.debtDueDate,
    state.totalPrice,
    state.address,
    state.pointsToUse,
    state.selectedPaymentMethods,
    state.paymentAmounts,
  ])

  const clearFilter = useOrdersFilterStore((state) => state.clearFilter)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('mobile'))
  const loginSource = useGetLoginSource()
  const navigate = useNavigate()

  const { mutate, ...query } = useMutation({
    mutationKey: [ApiKeys.Common.submitNewOrder],
    mutationFn: postQuery(getApiPaths().submitNewOrder),
    onSuccess() {
      toast.success('Заказ успешно создан')
      queryClient.refetchQueries({ queryKey: [ApiKeys.Common.navOrdersCount] })

      if (loginSource !== 'vendor' || !isMobile) {
        navigate(RouterPaths.orders)
      }

      clearCart()
      clearFilter()
      clearInfoСlient()
    },
    onError(error) {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data.message ||
            'Произошла ошибка при создании заказа',
        )
      }
    },
  })

  const submitOrder = () => {
    const wallets = selectedPaymentMethods.map(walletId => ({
      id: walletId,
      amount: roundToTwoDecimals(paymentAmounts[walletId] || 0)
    }))

    const basePayload: any = {
      warehouse_id: restaurantId,
      delivery_address: address,
      delivery_charge: roundToTwoDecimals(delivery),
      delivery_type: 'standard',
      delivery_man_id: deliveryMan?.id,
      comment: comment,
      comment_for_restaurant: commentRestaurant,
      loyalty_points_used: roundToTwoDecimals(pointsToUse || 0),
      wallets: wallets,
      products: foods.map((food) => {
        const matchedVariation = getFoodVariation(food, food.selectedVariations);
        let variationId: string | null = null;
        let variationPrice = food.basePrice;

        // Check if we have new variation structure (ProductVariation)
        if (matchedVariation && 'variation_id' in matchedVariation) {
          // New variation structure
          variationId = (matchedVariation as any).variation_id;
          variationPrice = Number((matchedVariation as any).sale_price);
        } else if (matchedVariation && 'type' in matchedVariation) {
          // Old variation structure (for backward compatibility)
          variationId = (matchedVariation as any).type;
          variationPrice = Number((matchedVariation as any).price);
        }

        // Round all numeric values to avoid floating-point errors
        const discountValue = food.discount_type === 'amount'
          ? (food.discount_value ?? 0)
          : (food.discount_value ?? food.discount ?? 0)

        return {
          id: food.id,
          quantity: food.quantity, // Quantity should be integer, but keep as is
          discount_type: (food.discount_type === 'amount' ? 'currency' : 'percentage'),
          discount: roundToTwoDecimals(discountValue),
          price: roundToTwoDecimals(variationPrice),
          variation_id: variationId, // Send variation_id instead of variation
        };
      }),
    }

    // Only include customer_id if a customer is selected
    if (customerId) {
      basePayload.customer_id = customerId
    }

    if (isInstallment) {
      const totalPriceWithDelivery = foods.reduce((sum, food) => {
        const matchedVariation = getFoodVariation(food, food.selectedVariations);
        let variationPrice = food.basePrice;

        if (matchedVariation && 'sale_price' in matchedVariation) {
          variationPrice = Number((matchedVariation as any).sale_price);
        } else if (matchedVariation && 'price' in matchedVariation) {
          variationPrice = Number((matchedVariation as any).price);
        }

        return sum + (variationPrice * food.quantity);
      }, 0) + (delivery || 0);

      const totalDueWithoutDelivery = totalPriceWithDelivery - (delivery || 0);

      basePayload.is_installment = true
      basePayload.initial_payment = roundToTwoDecimals(initialPayment)
      basePayload.due_date = debtDueDate
      basePayload.total_due = roundToTwoDecimals(totalDueWithoutDelivery)
      basePayload.remaining_balance = roundToTwoDecimals(totalDueWithoutDelivery - initialPayment)
    }


    if (customerAddressId) {
      mutate({
        ...basePayload,
        customer_address_id: customerAddressId,
      })
    } else {
      mutate({
        ...basePayload,
        delivery_address: deliveryAddress,
      })
    }
  }

  return { submitOrder, ...query }
}
