import { useParams } from 'react-router-dom'

import { LayoutContent } from '@widgets/layout'
import { EditTransferForm } from '@widgets/edit-transfer'
import { RouterPaths } from '@shared/lib'

export const Page = () => {
  return (
    <LayoutContent
      title="Редактирование перемещения"
      breadcrumbs={[
        {
          label: 'Склад',
          name: 'warehouse',
          path: RouterPaths.warehouse + '?report=flow'
        },
        {
          label: 'Редактирование перемещения',
          name: 'edit-transfer',
        }
      ]}
    >
      <EditTransferForm />
    </LayoutContent>
  )
}

