import { Box, Stack } from '@mui/material'

import { RouterPaths } from '@shared/lib'

import { LayoutContent } from '@widgets/layout'
import { FinancialIndicators, MonthlyFinanceStatistic } from '@widgets/finance'


export const Page = () => {
  return (
    <Box>
      <LayoutContent
        title='Общая информация по финансам'
        breadcrumbs={[
          {
            label: 'Аналитика',
            name: 'analytic',
            path: RouterPaths.analytic
          },
          {
            label: 'Финансы',
            name: 'finance',
            path: RouterPaths.finance
          },
          {
            label: 'Показатели',
            name: 'indicators'
          }
        ]}
      >
        <Stack spacing="24px" >
            <FinancialIndicators />
            <MonthlyFinanceStatistic />
        </Stack>
      </LayoutContent>
    </Box>
  )
}