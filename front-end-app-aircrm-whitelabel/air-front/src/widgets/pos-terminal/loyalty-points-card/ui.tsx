import { CollapsibleCard } from '@shared/ui'
import { InputLoyaltyPoints } from '@features/pos-terminal/ui/select-customer/input-loyalty-points'

export const LoyaltyPointsCard = () => {
  return (
    <CollapsibleCard
      title="Списать баллы"
      defaultExpanded={false}
      sx={{ mb: 2 }}
    >
      <InputLoyaltyPoints />
    </CollapsibleCard>
  )
}
