import { Admins } from '@widgets/admins'
import { LayoutContent } from '@widgets/layout'
import {
  CreateAdminButton,
  CreateAdminDialog,
  UpdateAdminDialog,
} from '@features/admins'

export const Page = () => {
  return (
    <LayoutContent
      title="Сотрудники"
      breadcrumbs={[
        {
          label: 'Сотрудники',
          name: 'employees',
        },
      ]}
      rightSlot={<CreateAdminButton />}
    >
      <CreateAdminDialog />
      <UpdateAdminDialog />
      <Admins />
    </LayoutContent>
  )
}
