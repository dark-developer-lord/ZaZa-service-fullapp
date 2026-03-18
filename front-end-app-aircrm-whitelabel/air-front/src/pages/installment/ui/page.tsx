import { Stack } from '@mui/material'

import { LayoutContent } from '@widgets/layout'
import { SystemAnalyticDropdown } from '@features/analytic/system-analytic-dropdown'
import { InstallmentsTable } from '@widgets/finance/ui/installments-table/table'
import { InstallmentFilterList } from '@entities/installment/ui/filter-list'
import { NavigationCards } from '@widgets/finance/ui/navigation-cards'

export const Page = () => {
  return (
    <LayoutContent
      title="Рассрочка"
      breadcrumbs={[
        { label: 'Финансы', name: 'finance', path: '/financial-overview' },
        { label: 'Рассрочка', name: 'installments' }
      ]}
      rightSlot={<SystemAnalyticDropdown />}
    >
      <Stack spacing="24px">
        <NavigationCards />
        <InstallmentFilterList />

        <InstallmentsTable />
      </Stack>
    </LayoutContent>
  )
}
