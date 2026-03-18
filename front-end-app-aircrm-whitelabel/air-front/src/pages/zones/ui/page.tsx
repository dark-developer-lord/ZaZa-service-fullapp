import { LayoutContent } from '@widgets/layout'
import { Zones } from '@widgets/zones'
import { CreateZoneButton } from '@features/zones'

export const Page = () => {
  return (
    <LayoutContent
      title="Зоны"
      breadcrumbs={[
        {
          label: 'Зоны',
          name: 'zones',
        },
      ]}
      rightSlot={<CreateZoneButton />}
    >
      <Zones />
    </LayoutContent>
  )
}
