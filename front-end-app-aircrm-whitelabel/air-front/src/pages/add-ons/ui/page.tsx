import { AddOns } from '@widgets/add-ons'
import { LayoutContent } from '@widgets/layout'
import {
  CreateAddOnButton,
  CreateAddOnDialog,
  UpdateAddOnDialog,
} from '@features/add-ons'

export const Page = () => {
  return (
    <LayoutContent
      title="Список дополнений"
      breadcrumbs={[
        {
          label: 'Список дополнений',
          name: 'add-ons',
        },
      ]}
      rightSlot={<CreateAddOnButton />}
    >
      <CreateAddOnDialog />
      <UpdateAddOnDialog />
      <AddOns />
    </LayoutContent>
  )
}
