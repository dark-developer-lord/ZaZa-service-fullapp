import { EditProductForm } from '@widgets/edit-product'
import { LayoutContent } from '@widgets/layout'
import { RouterPaths } from '@shared/lib'

export const Page = () => {
  return (
    <LayoutContent
      title="Изменить товар"
      breadcrumbs={[
        {
          label: 'Список товаров',
          name: 'foods',
          path: RouterPaths.warehouse,
        },
        {
          label: 'Изменить товар',
          name: 'update-product',
        },
      ]}
    >
      <EditProductForm />
    </LayoutContent>
  )
}
