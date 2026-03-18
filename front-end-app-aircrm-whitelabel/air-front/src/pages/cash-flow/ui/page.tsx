import { LayoutContent } from '@widgets/layout'
import {
  Stack,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { Transactions } from '@widgets/finance'
import { CreateCashFlowForm  } from '@features/finance'
import { UpdateTransactionDialog } from '@features/analytic/cash-flow/create-update'
import { CreateTransactionCategoryDialog } from '@features/transaction-categories/create-update'
import { CreateTransactionSubCategoryDialog } from '@features/transaction-sub-categories/create-update'
import { SystemAnalyticDropdown } from '@features/analytic/system-analytic-dropdown'
import { NavigationCards } from '@widgets/finance/ui/navigation-cards'

export const Page = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('mobile'))
  return (
    <LayoutContent
      title="ДДС"
      breadcrumbs={[
        {
          label: 'Финансы',
          name: 'finance',
          path: '/financial-overview'
        },
        {
          label: 'ДДС',
          name: 'cash-flow',
        },
      ]}
      rightSlot={<SystemAnalyticDropdown />}
    >
      <Stack spacing={3}>
        <NavigationCards />
        {!isMobile && <CreateCashFlowForm />}
        <Transactions />
        <UpdateTransactionDialog />
        <CreateTransactionCategoryDialog />
        <CreateTransactionSubCategoryDialog />
      </Stack>
    </LayoutContent>
  )
}
