import { LayoutContent } from '@widgets/layout'
import { Restaurants } from '@widgets/warehouses'
import {
  CreateWarehouseButton,
  CreateWarehouseDialog,
  UpdateWarehouseDialog,
} from '@features/warehouses'
import { SystemWarehouseDropdown } from '@features/products'
import { RouterPaths } from '@shared/lib'

export const Page = () => {
  return (
    <LayoutContent
      title="Список складов"
      breadcrumbs={[
        {
          label: 'Склад',
          name: 'warehouse',
          path: RouterPaths.warehouse,
        },
        {
          label: 'Список складов',
          name: 'warehouses',
        },
      ]}
      rightSlot={
        <>
          <CreateWarehouseButton />
          <SystemWarehouseDropdown />
        </> 
      }
    >
      <CreateWarehouseDialog />
      <UpdateWarehouseDialog />
      <Restaurants />
    </LayoutContent>
  )
}
