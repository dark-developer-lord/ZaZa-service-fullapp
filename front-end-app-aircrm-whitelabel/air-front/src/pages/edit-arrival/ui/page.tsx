import { LayoutContent } from '@widgets/layout'
import { EditArrivalForm } from '@widgets/edit-arrival'
import { RouterPaths } from '@shared/lib'

export const Page = () => {
  return (
    <LayoutContent
      title="Изменить приход"
      breadcrumbs={[
        {
          label: 'Склад',
          name: 'warehouse',
          path: RouterPaths.warehouse + '?report=receipt'
        },
        {
          label: 'Изменить приход',
          name: 'edit-receipt',
        }
      ]}
    >
      <EditArrivalForm />
    </LayoutContent>
  )
}
