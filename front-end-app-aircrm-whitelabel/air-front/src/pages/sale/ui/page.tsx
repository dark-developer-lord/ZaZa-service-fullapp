import { LayoutContent } from '@widgets/layout'
import { EditArrivalForm } from '@widgets/edit-arrival'
import { RouterPaths } from '@shared/lib'

export const Page = () => {  
  return (
    <LayoutContent
      title="Реализация"
      breadcrumbs={[
        {
          label: 'Склад',
          name: 'warehouse',
          path: RouterPaths.warehouse + '?report=arrival'
        },
        {
          label: 'Изменить приход',
          name: 'edit-arrival',
        }
      ]}
    >
      <EditArrivalForm />
    </LayoutContent>
  )
}
