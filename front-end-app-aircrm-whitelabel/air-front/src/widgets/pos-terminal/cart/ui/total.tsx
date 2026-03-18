import { Stack } from '@mui/material'

import { useCartStore } from '@features/pos-terminal'
import { InfoItem } from '@shared/ui'

import { useGetCartTotal } from '../lib/get-cart-total'
import { useGetCartDiscount } from '../lib/get-cart-discount'

export const Total = () => {
  const [delivery, pointsToUse, customer] = useCartStore((state) => [
    state.delivery,
    state.pointsToUse,
    state.customer
  ])
  const totalAmount = useGetCartTotal() // Original total without discounts
  const productDiscount = useGetCartDiscount() // Total product discounts

  // Calculate points discount (1 point = 1 somoni)
  const pointsDiscount = pointsToUse || 0

  // Calculate final amount to pay: Итого - Скидка - Списанные баллы + Доставка
  // Round each step to avoid floating-point errors
  const finalAmount = Math.round(
    ((totalAmount ?? 0) - productDiscount - pointsDiscount + (delivery ?? 0)) * 100
  ) / 100

  // Calculate points to earn: К оплате × customer's loyalty percentage
  const loyaltyPercentage = customer?.loyalty_point_percentage || 0
  const pointsToEarn = Math.round((finalAmount * (loyaltyPercentage / 100)) * 100) / 100

  return (
    <Stack spacing="16px">
      <InfoItem
        label="Итого"
        total={totalAmount}
      />
      <InfoItem
        label="Скидка"
        total={productDiscount}
        totalProps={{ color: 'error.main' }}
      />
      <InfoItem
        label="Списанные баллы"
        total={pointsDiscount}
        totalProps={{ color: 'error.main' }}
      />
      <InfoItem
        label="Доставка"
        total={delivery || 0}
      />
      <InfoItem
        label="К оплате"
        total={finalAmount}
      />
      <InfoItem
        label="К начислению баллов"
        total={pointsToEarn}
        totalProps={{ color: 'success.main' }}
      />
    </Stack>
  )
}
