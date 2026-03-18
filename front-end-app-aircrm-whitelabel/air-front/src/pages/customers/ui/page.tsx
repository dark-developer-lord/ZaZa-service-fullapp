import { Customers } from '@widgets/customers'
import { AddCustomerButton } from '@features/customers'
import { CustomerFilterList } from '@entities/customer'
import { LayoutContent } from '@widgets/layout'
import { AIAdvisorButton, AIAdvisorModal } from '@features/ai-advisor'

export const Page = () => {
  return (
    <LayoutContent
      title="Список клиентов"
      rightSlot={<AddCustomerButton />}
      breadcrumbs={[
        {
          label: 'Список клиентов',
          name: 'customers',
        }
      ]}
    >
      {/* Filter cards outside of Paper */}
      <CustomerFilterList />

      {/* <CreateCategoryDialog /> */}
      {/*<UpdateCategoryDialog />*/}
      <Customers />

      {/* AI Advisor */}
      <AIAdvisorButton page="customers" />
      <AIAdvisorModal />
    </LayoutContent>
  )
}
