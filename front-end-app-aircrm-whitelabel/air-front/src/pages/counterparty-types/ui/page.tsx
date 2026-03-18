import { CounterpartyTypes } from '@widgets/counterparty-types'
import { LayoutContent } from '@widgets/layout'
import {
  CreateCounterpartyTypeButton,
  CreateCounterpartyTypeDialog,
  UpdateCounterpartyTypeDialog
} from '@features/counterparty-types'
import { SystemAnalyticDropdown } from '@features/analytic/system-analytic-dropdown'

export const Page = () => {
  return (
    <LayoutContent
      title="Типы контрагентов"
      breadcrumbs={[
        {
          label: 'Финансы',
          name: 'finance',
          path: '/financial-overview'
        },
        {
          label: 'Контрагенты',
          name: 'counterparties',
          path: '/counterparties'
        },
        {
          label: 'Типы контрагентов',
          name: 'counterparty-types',
        },
      ]}
      rightSlot={
        <>
          <CreateCounterpartyTypeButton />
          <SystemAnalyticDropdown />
        </>
      }
    >
      <CreateCounterpartyTypeDialog />
      <UpdateCounterpartyTypeDialog />
      <CounterpartyTypes />
    </LayoutContent>
  )
}

