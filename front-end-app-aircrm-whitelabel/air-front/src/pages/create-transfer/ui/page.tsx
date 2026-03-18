import { LayoutContent } from '@widgets/layout'
import { CreateTransferForm } from '@widgets/create-transfer'

import { RouterPaths } from '@shared/lib'

export const Page = () => {
  return (
    <LayoutContent
      title="Новое перемещение"
      breadcrumbs={[
        {
          label: 'Склад',
          name: 'warehouse',
          path: RouterPaths.warehouse + '?report=flow'
        },
        {
          label: 'Перемещение',
          name: 'warehouse-transfer',
        },
      ]}
    >
      <CreateTransferForm />
    </LayoutContent>
  )
}

