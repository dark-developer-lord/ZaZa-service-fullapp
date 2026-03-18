import { Stack } from '@mui/material'

import { LayoutContent } from '@widgets/layout'
import { SystemAnalyticDropdown } from '@features/analytic/system-analytic-dropdown'
import { Counterparties } from '@widgets/counterparties'
import { NavigationCards } from '@widgets/finance/ui/navigation-cards'
import { AddCounterpartyButton, EditCounterpartyDialog } from '@features/counterparties'
import { SystemCounterpartyDropdown } from '@features/counterparties/system-dropdown'

export const Page = () => {
  return (
    <LayoutContent
      title="Контрагенты"
      breadcrumbs={[
        { label: 'Финансы', name: 'finance', path: '/financial-overview' },
        { label: 'Контрагенты', name: 'counterparties' }
      ]}
      rightSlot={
        <>
          <AddCounterpartyButton />
          <SystemCounterpartyDropdown />
        </>
      }
    >
      <Stack spacing="24px">
        <NavigationCards />
        <Counterparties />
      </Stack>
      <EditCounterpartyDialog />
    </LayoutContent>
  )
}

