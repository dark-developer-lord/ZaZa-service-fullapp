import { Attributes } from '@widgets/attributes'
import { LayoutContent } from '@widgets/layout'
import {
  CreateAttributeButton,
  CreateAttributeDialog,
  UpdateAttributeDialog,
} from '@features/attributes'
import { SystemWarehouseDropdown } from '@features/products'

export const Page = () => {
  return (
    <LayoutContent
      title="Атрибуты"
      breadcrumbs={[
        {
          label: 'Атрибуты',
          name: 'attributes',
        },
      ]}
      rightSlot={ <> <CreateAttributeButton /> <SystemWarehouseDropdown/> </> }
    >
      <CreateAttributeDialog />
      <UpdateAttributeDialog />
      <Attributes />
    </LayoutContent>
  )
}
