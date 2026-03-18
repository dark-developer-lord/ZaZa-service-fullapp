import { Employees } from '@widgets/employees'
import { LayoutContent } from '@widgets/layout'
import {
  CreateEmployeeButton,
  CreateEmployeeDialog,
  UpdateEmployeeDialog,
} from '@features/employees'

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
      rightSlot={<CreateEmployeeButton />}
    >
      <CreateEmployeeDialog />
      <UpdateEmployeeDialog />
      <Employees />
    </LayoutContent>
  )
}
