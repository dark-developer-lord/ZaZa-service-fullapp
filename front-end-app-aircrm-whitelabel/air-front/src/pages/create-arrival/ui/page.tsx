import { LayoutContent } from '@widgets/layout'
import { CreateArrivalForm } from '@widgets/create-arrival'

import { RouterPaths } from '@shared/lib'

export const Page = () => {
  return (
    <LayoutContent
      title="Новый приход"
      breadcrumbs={[
        {
          label: 'Склад',
          name: 'warehouse',
          path: RouterPaths.warehouse + '?report=receipt'
        },
        {
          label: 'Приход',
          name: 'warehouse-receipt',
        },
      ]}
    >
      <CreateArrivalForm />
    </LayoutContent>
  )
}
