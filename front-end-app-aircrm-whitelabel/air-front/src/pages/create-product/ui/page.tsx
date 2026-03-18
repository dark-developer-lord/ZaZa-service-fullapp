import { CreateProductForm } from '@widgets/create-product'
import { LayoutContent } from '@widgets/layout'
import { RouterPaths } from '@shared/lib'

export const Page = () => {
  return (
    <LayoutContent
      title="Добавить новый товар"
      breadcrumbs={[
        {
          label: 'Список товаров',
          name: 'foods',
          path: RouterPaths.warehouse,
        },
        {
          label: 'Добавить новый товар',
          name: 'create-food',
        },
      ]}
    >
      <CreateProductForm />
    </LayoutContent>
  )
}
