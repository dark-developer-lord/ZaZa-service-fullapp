import { Couriers } from '@widgets/couriers'
import { LayoutContent } from '@widgets/layout'
import {
  CreateCourierButton,
  CreateCourierDialog,
  UpdateCourierDialog,
} from '@features/couriers'

export const Page = () => {
  return (
    <LayoutContent
      title="Список курьеров"
      breadcrumbs={[
        {
          label: 'Курьеры',
          name: 'couriers'
        },
        {
          label: 'Список курьеров',
          name: 'couriers',
        },
      ]}
      rightSlot={<CreateCourierButton />}
    >
      <CreateCourierDialog />
      <UpdateCourierDialog />
      <Couriers />
    </LayoutContent>
  )
}
