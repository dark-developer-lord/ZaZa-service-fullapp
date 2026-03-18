import toast from 'react-hot-toast'
import { LoadingButton } from '@mui/lab'

import { useSubmitNewOrder } from '../api/submit-new-order'
import { useCartStore } from '../model/cart-store'
import { useMediaQuery, useTheme } from '@mui/material'
import { InstallmentFields } from './installment-fields'
import { useGetLoginSource } from '@shared/auth'
import { useGetAvailableWallets } from '../api/get-available-wallets'

export const SubmitOrder = () => {
  const loginSource = useGetLoginSource()


  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('mobile'))

  const { data: walletsResponse } = useGetAvailableWallets()
  const availableWallets = walletsResponse?.wallets || []

  const [
    existFoods,
    isNotAvailableFoods,
    customer,
    address,
    commentRestaurant,
    comment,
    isInstallment,
    initialPayment,
    selectedPaymentMethods,
  ] = useCartStore((state) => [
    state.foods.length > 0,
    state.foods.some((food) => food.isNotAvailable),
    state.customer,
    state.address.trim(),
    state.commentForRestaurant,
    state.comment,
    state.isInstallment,
    state.initialPayment,
    state.selectedPaymentMethods,
  ])
  


  const createOrderObject = (address: string): {
    customerId?: number,
    deliveryAddress?: string,
    customerAddressId?: number,
    commentRestaurant: string,
    comment: string
  } => {
    // If no customer selected, return minimal order object
    if (!customer) {
      return {
        deliveryAddress: address || '',
        commentRestaurant: commentRestaurant || '',
        comment: comment || '',
      }
    }

    const customerAddress = customer.addresses.find(
      (addressItem) => addressItem.road === address,
    )

    if (customerAddress) {
      return {
        customerId: customer.id,
        customerAddressId: customerAddress.id,
        commentRestaurant: commentRestaurant || '',
        comment: comment || '',
      }
    }

    return {
      customerId: customer.id,
      deliveryAddress: address || '',
      commentRestaurant: commentRestaurant || '',
      comment: comment || '',
    }
  }

  const { submitOrder, isLoading } = useSubmitNewOrder(
    createOrderObject(address)
  )

  const paymentMethodsEnabled = !isInstallment || (isInstallment && initialPayment > 0)
  const hasAvailableWallets = availableWallets.length > 0
  const hasSelectedPaymentMethod = Array.isArray(selectedPaymentMethods) && selectedPaymentMethods.length > 0
  const isPaymentMethodRequired = hasAvailableWallets && paymentMethodsEnabled
  const isPaymentMethodValid = !isPaymentMethodRequired || hasSelectedPaymentMethod

  
  const isInstallmentValid = !isInstallment || (isInstallment && customer)

  return (
    <>
      {loginSource === 'vendor' && <InstallmentFields />}

      <LoadingButton
        fullWidth
        size={isMobile ? 'medium' : 'large'}
        sx={{ mt: '24px' }}
        loading={isLoading}
        disabled={!existFoods || isNotAvailableFoods || !isPaymentMethodValid || !isInstallmentValid}
        onMouseEnter={() => {}}
        onClick={() => {
          if (!existFoods) {
            toast.error('Выберите товары')
            return
          }
          if (isNotAvailableFoods) {
            toast.error('Удалите недоступные товары')
            return
          }
          if (!isPaymentMethodValid) {
            toast.error('Выберите способ оплаты')
            return
          }
          if (!isInstallmentValid) {
            toast.error('Выберите клиента для оформления рассрочки')
            return
          }
          submitOrder()
        }}
      >
        Оформить заказ
      </LoadingButton>
    </>
  )
}
