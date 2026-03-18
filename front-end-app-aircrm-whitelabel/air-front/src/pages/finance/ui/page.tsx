import { Box, Stack, useMediaQuery, useTheme } from '@mui/material'


import { LayoutContent } from '@widgets/layout'
import {
  AnalyticTable,
  FinancialIndicators,
  MonthlyFinanceStatistic
} from '@widgets/finance'

import { SystemAnalyticDropdown } from '@features/analytic/system-analytic-dropdown'
import { NavigationCards } from '@widgets/finance/ui/navigation-cards'

export const Page = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('mobile'))

  return (
      <LayoutContent
        title="Финансы"
        breadcrumbs={[
          {
            label: 'Финансы',
            name: 'finance',
            path: '/financial-overview'
          },
          {
            label: 'Финансы',
            name: 'finance-page'
          }
        ]}
        rightSlot={ <SystemAnalyticDropdown /> }
      >
        <Stack spacing="24px" >
            <NavigationCards />
            <FinancialIndicators />
            <MonthlyFinanceStatistic />
            <AnalyticTable />
        </Stack>
      </LayoutContent>
  )
}