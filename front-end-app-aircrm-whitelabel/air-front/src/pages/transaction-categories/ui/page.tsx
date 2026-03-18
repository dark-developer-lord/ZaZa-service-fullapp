import { TransactionCategories } from '@widgets/transaction-categories'
import { LayoutContent } from '@widgets/layout'
import {
  CreateCategoryButton,
  CreateTransactionCategoryDialog,
  UpdateTransactionCategoryDialog
} from '@features/transaction-categories'
import { SystemAnalyticDropdown } from '@features/analytic/system-analytic-dropdown'

export const Page = () => {
  return (
    <LayoutContent
      title="Категории"
      breadcrumbs={[
        {
          label: 'Категории',
          name: 'categories',
        },
      ]}
      rightSlot={ <> <CreateCategoryButton /> <SystemAnalyticDropdown/> </> }
    >
      <CreateTransactionCategoryDialog />
      <UpdateTransactionCategoryDialog />
      <TransactionCategories />
    </LayoutContent>
  )
}
