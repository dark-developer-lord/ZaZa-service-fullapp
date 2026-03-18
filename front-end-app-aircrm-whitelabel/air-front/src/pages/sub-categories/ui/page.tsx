import { LayoutContent } from '@widgets/layout'
import { SubCategories } from '@widgets/sub-categories'
import {
  CreateSubCategoryButton,
  CreateSubCategoryDialog,
  UpdateSubCategoryDialog,
} from '@features/sub-categories'
import { SystemWarehouseDropdown } from '@features/products'

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
      rightSlot={ <> <CreateSubCategoryButton /> <SystemWarehouseDropdown/> </> }
    >
      <CreateSubCategoryDialog />
      <UpdateSubCategoryDialog />
      <SubCategories />
    </LayoutContent>
  )
}
