import { LayoutContent } from '@widgets/layout'
import { PointsReport } from '@widgets/points-report'

export const Page = () => {
  return (
    <LayoutContent
      title="Отчет по баллам"
      breadcrumbs={[
        {
          label: 'Отчет по баллам',
          name: 'points-report',
        },
      ]}
    >
      <PointsReport />
    </LayoutContent>
  )
}
