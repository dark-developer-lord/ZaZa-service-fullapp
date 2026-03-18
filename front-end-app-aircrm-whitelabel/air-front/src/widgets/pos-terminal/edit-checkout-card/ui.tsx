import { Divider, Stack } from '@mui/material'

import { CollapsibleCard } from '@shared/ui'
import { InputLoyaltyPoints } from '@features/pos-terminal/ui/select-customer/input-loyalty-points'
import { TotalCartInfo } from '@widgets/pos-terminal'
import { EditOrder } from '@features/pos-terminal'
import { InstallmentFields } from '@features/pos-terminal/ui/installment-fields'
import { PaymentMethods } from '@features/pos-terminal/ui/payment-methods'
import { useGetLoginSource } from '@shared/auth'

export const EditCheckoutCard = () => {
  const loginSource = useGetLoginSource()

  return (
    <CollapsibleCard
      title="Оформление заказа"
      defaultExpanded={true}
      sx={{ mb: 2, bgcolor: 'white' }}
    >
      <Stack spacing={3}>
        <InputLoyaltyPoints />

        <Divider />

        <TotalCartInfo />

        {loginSource === 'vendor' && <InstallmentFields />}

        <PaymentMethods />

        <EditOrder />
      </Stack>
    </CollapsibleCard>
  )
}
