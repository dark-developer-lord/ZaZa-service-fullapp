import { Divider, Stack } from '@mui/material'

import { CollapsibleCard } from '@shared/ui'
import { InputLoyaltyPoints } from '@features/pos-terminal/ui/select-customer/input-loyalty-points'
import { TotalCartInfo } from '@widgets/pos-terminal'
import { SubmitNewOrder } from '@features/pos-terminal'
import { PaymentMethods } from '@features/pos-terminal/ui/payment-methods'

export const CheckoutCard = () => {
  return (
    <CollapsibleCard
      title="Оформление заказа"
      defaultExpanded={false}
      sx={{ mb: 2, bgcolor: 'white' }}
    >
      <Stack spacing={3}>
        <InputLoyaltyPoints />

        <Divider />

        <TotalCartInfo />

        <PaymentMethods />

        <SubmitNewOrder />
      </Stack>
    </CollapsibleCard>
  )
}
