import { LayoutContent } from '@widgets/layout'
import { TransactionSubCategories } from '@widgets/transaction-sub-categories'
import {
  CreateTransactionSubCategoryButton,
  CreateTransactionSubCategoryDialog,
  UpdateTransactionSubCategoryDialog
} from '@features/transaction-sub-categories'
import { SystemAnalyticDropdown } from '@features/analytic/system-analytic-dropdown'

export const Page = () => {
  return (
    <LayoutContent
      title="Подкатегории"
      breadcrumbs={[
        {
          label: 'Подкатегории',
          name: 'subcategories',
        },
      ]}
      rightSlot={ <> <CreateTransactionSubCategoryButton /> <SystemAnalyticDropdown/> </> }
    >
      <CreateTransactionSubCategoryDialog />
      <UpdateTransactionSubCategoryDialog />
      <TransactionSubCategories />
    </LayoutContent>
  )
}
