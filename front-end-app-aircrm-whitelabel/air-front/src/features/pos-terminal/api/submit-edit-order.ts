import toast from 'react-hot-toast'
import { useMutation } from 'react-query'
import { useParams, useNavigate } from 'react-router-dom'
import { AxiosError } from 'axios'

import { getFoodVariation } from '@entities/cart'
import { useGetOrder } from '@entities/orders'
import { ApiKeys, getApiPaths, putQuery, queryClient } from '@shared/api'

import { RouterPaths } from '@shared/lib'
import { useOrdersFilterStore } from '../../orders'
import { useCartStore } from '../model/cart-store'

// Helper function to round numbers to 2 decimal places, avoiding floating-point errors
const roundToTwoDecimals = (value: number | null | undefined): number => {
  if (value === null || value === undefined) return 0
  return Math.round(value * 100) / 100
}

export const useEditOrder = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [
    foods,
    clearCart,
    restaurantId,
    comment,
    commentForRestaurant,
    clearInfoСlient,
    delivery,
    address,
    isInstallment,
    initialPayment,
    debtDueDate,
    pointsToUse,
    selectedPaymentMethods,
    paymentAmounts,
  ] = useCartStore((state) => [
    state.foods,
    state.clearCart,
    state.restaurantId,
    state.comment,
    state.commentForRestaurant,
    state.clearInfoСlient,
    state.delivery,
    state.address,
    state.isInstallment,
    state.initialPayment,
    state.debtDueDate,
    state.pointsToUse,
    state.selectedPaymentMethods,
    state.paymentAmounts,
  ])
  const clearFilter = useOrdersFilterStore((state) => state.clearFilter)
  const { data: order } = useGetOrder()
  const { mutate, ...query } = useMutation({
    mutationKey: [ApiKeys.Common.editOrder_ + id],
    mutationFn: putQuery(getApiPaths().editOrder_ + id),
    onSuccess() {
      toast.success('Заказ успешно изменен')
      queryClient.refetchQueries({
        queryKey: [ApiKeys.Orders.getOrder_ + id],
      })
      navigate(RouterPaths.orders_ + id)
      clearCart()
      clearFilter()
      clearInfoСlient()
    },
    onError(error) {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data.message ||
            'Произошла ошибка при изменении заказа',
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
      _method: 'PUT',
      delivery_address: address,
      warehouse_id: restaurantId,
      comment,
      delivery_charge: roundToTwoDecimals(delivery),
      comment_for_restaurant: commentForRestaurant,
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
          variation_id: variationId, // Send variation_id instead of variation
          add_ons: food.selectedAddons,
          discount_type: (food.discount_type === 'amount' ? 'currency' : 'percentage'),
          discount: roundToTwoDecimals(discountValue),
          price: roundToTwoDecimals(variationPrice),
        }
      }),
    }

    if (isInstallment) {
      basePayload.is_installment = true
      basePayload.initial_payment = roundToTwoDecimals(initialPayment)
      basePayload.due_date = debtDueDate

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

      basePayload.total_due = roundToTwoDecimals(totalDueWithoutDelivery)
      basePayload.remaining_balance = roundToTwoDecimals(totalDueWithoutDelivery - initialPayment)
    }

    mutate(basePayload)
  }

  return { submitOrder, ...query }
}
