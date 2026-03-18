import { LayoutContent } from '@widgets/layout'

export const Page = () => {
  return (
    <LayoutContent
      title="Добавить сотрудника"
      breadcrumbs={[
        {
          label: 'Сотрудники',
          name: 'employees',
        },
        {
          label: 'Добавить сотрудника',
          name: 'create-employee',
        },
      ]}
    >
      Hello
    </LayoutContent>
  )
}
