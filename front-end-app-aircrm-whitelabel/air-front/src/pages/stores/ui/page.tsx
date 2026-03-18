import { LayoutContent } from '@widgets/layout'
import { Stores } from '@widgets/stores'
import { CreateStoreButton, CreateStoreDialog, UpdateStoreDialog } from '@features/store'

export const Page = () => {
  return (
    <LayoutContent
      title="Список магазинов"
      breadcrumbs={[
        {
          label: 'Список магазинов',
          name: 'warehouses',
        },
      ]}
      rightSlot={<CreateStoreButton />}
    >
      <CreateStoreDialog />
      <UpdateStoreDialog/>
      <Stores />
    </LayoutContent>
  )
}
