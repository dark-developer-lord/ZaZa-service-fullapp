/* eslint-disable prettier/prettier */
import { Categories } from '@widgets/categories'
import { LayoutContent } from '@widgets/layout'
import {
  CreateCategoryButton,
  CreateCategoryDialog,
  UpdateCategoryDialog,
} from '@features/categories'
import { SystemWarehouseDropdown } from '@features/products'

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
      rightSlot={ <> <CreateCategoryButton /> <SystemWarehouseDropdown/> </> }
    >
      <CreateCategoryDialog />
      <UpdateCategoryDialog />
      <Categories />
    </LayoutContent>
  )
}
