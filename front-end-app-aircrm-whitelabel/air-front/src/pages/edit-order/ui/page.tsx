import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Grid, Stack } from '@mui/material'
import { AxiosError } from 'axios'

import { useGetLoginSource } from '@shared/auth'

import { LayoutContent } from '@widgets/layout'
import {
  EditOrderFilter,
  FoodList,
  CartCard,
  CustomerInfoCard,
  EditCheckoutCard,
} from '@widgets/pos-terminal'
import { CourierAssignButton } from '@features/order-show'
import {
  FoodModal,
  useCartStore,
  useOrderFoodToCart,
} from '@features/pos-terminal'
import {
  OrderCourierInfo,
  OrderCustomerInfo,
  useGetOrder,
} from '@entities/orders'
import { RouterPaths } from '@shared/lib'


import { NotFound } from './not-found'

export const Page = () => {
  const { id: orderId } = useParams()
  const { data, isLoading, error } = useGetOrder()
  const loginSource = useGetLoginSource()
  const setCart = useCartStore((state) => state.setCart)

  const order = data?.data
  const orderInstallment = order?.orderInstallment
  useEffect(() => {
  if (!data?.data) return;

  const order = data.data

  // Parse loyalty points - API returns as string, need to convert to number
  const loyaltyPoints = order.customer.loyalty_points
    ? parseFloat(order.customer.loyalty_points)
    : (order.customer.loyalty_point ?? 0)

  const loyaltyPointsPercentage = order.customer.loyalty_points_percentage
    ? parseFloat(order.customer.loyalty_points_percentage)
    : (order.customer.loyalty_point_percentage ?? 0)

  setCart({
    foods: order.products.map((item) => {
      const basePrice = item.details.price;
      const currentPrice = item.price;
      const discountPercent = basePrice > 0 ? Math.round(((basePrice - currentPrice) / basePrice) * 100) : 0;

      return{
        foodKey: `order-${item.id}`,
        id: item.details.id,
        name: item.details.name,
        price: item.price,
        basePrice: basePrice,
        discount: discountPercent,
        discount_type: 'percentage',
        discount_value: discountPercent,
        image: item.details.image,
        quantity: item.quantity,
        selectedVariations: {},
        selectedAddons: [],
        isNotAvailable: false,
        variations: [],
        choice_options: [],
        add_ons: [],
      }
    }),
    zoneId: order.zone_id ?? null,
    restaurantId: order.warehouse?.id ?? null,
    mainRestaurantId: null,
    customer: {
      id: order.customer.id,
      name: order.customer.f_name ?? '',
      phone: order.customer.phone,
      addresses: [],
      loyalty_point: loyaltyPoints,
      loyalty_point_percentage: loyaltyPointsPercentage,
      default_address: typeof order.delivery_address === 'object' ? order.delivery_address?.road ?? '' : order.delivery_address ?? '', // Set the default_address from order
    },
    address: typeof order.delivery_address === 'object' ? order.delivery_address?.road ?? '' : order.delivery_address ?? '',
    commentForRestaurant: order.comment_for_restaurant ?? '',
    comment: order.comment ?? '',
    delivery: order.delivery_charge ?? 0,
    deliveryMan: order.delivery_man ?? null,
  })

  // Set additional state properties separately
  const cartStore = useCartStore.getState()

  if (order.is_installment && orderInstallment) {
    cartStore.setIsInstallment(true)
    cartStore.setInitialPayment(parseFloat(orderInstallment.initial_payment))
    cartStore.setDebtDueDate(orderInstallment.due_date)
  } else {
    cartStore.setIsInstallment(false)
    cartStore.setInitialPayment(0)
    cartStore.setDebtDueDate('')
  }

  cartStore.setTotalPrice(order.order_amount ?? 0)

  // Set points used from order if available
  if (order.points_used) {
    cartStore.setPointsToUse(parseFloat(order.points_used))
  }

  // Load payment methods from order wallets
  if (order.wallets && order.wallets.length > 0) {
    const walletIds = order.wallets.map(w => w.wallet_id)
    const walletAmounts: Record<number, number> = {}
    order.wallets.forEach(w => {
      walletAmounts[w.wallet_id] = w.amount
    })
    cartStore.setSelectedPaymentMethods(walletIds)
    Object.entries(walletAmounts).forEach(([id, amount]) => {
      cartStore.setPaymentAmount(Number(id), amount)
    })
  }
}, [data])


  useOrderFoodToCart()

  const [clearFilter, clearInfoСlient, clearCart] = useCartStore((state) => [
    state.clearFilter,
    state.clearInfoСlient,
    state.clearCart,
  ])

  useEffect(() => {
    return () => {
      clearFilter()
      clearInfoСlient()
      clearCart()
    }
  }, [])

  if (error && error instanceof AxiosError && error.response?.status === 404) {
    return <NotFound />
  }

  return (
    <LayoutContent
      title="Изменить заказ"
      breadcrumbs={[
        {
          label: 'Все заказы',
          path: RouterPaths.orders,
          name: 'orders',
        },
        {
          label: 'Подробнее',
          name: 'order-show',
          path: RouterPaths.orders_ + orderId,
        },
        {
          label: 'Изменить заказ',
          name: 'order-edit',
        },
      ]}
    >
      <FoodModal />
      <Grid
        container
        spacing="16px"
      >
        <Grid
          item
          xs={12}
          mobile={7}
        >
          <Stack spacing="16px">
            <EditOrderFilter />
            <FoodList />
          </Stack>
        </Grid>
        <Grid
          item
          xs={12}
          mobile={5}
        >
          <Stack spacing="16px">
            <OrderCourierInfo ButtonSlot={CourierAssignButton} />
            <OrderCustomerInfo />
            {/* <OrderComments /> */}
            <CartCard />
            <CustomerInfoCard />
            <EditCheckoutCard />
          </Stack>
        </Grid>
      </Grid>
    </LayoutContent>
  )
}
