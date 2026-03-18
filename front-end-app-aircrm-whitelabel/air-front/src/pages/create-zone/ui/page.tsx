import { LayoutContent } from '@widgets/layout'
import { CreateZoneForm } from '@features/zones'

import 'leaflet/dist/leaflet.css'
import 'leaflet-draw/dist/leaflet.draw.css'

export const Page = () => {
  return (
    <LayoutContent
      title="Добавить зону"
      breadcrumbs={[
        {
          label: 'Добавить зону',
          name: 'add-zone',
        },
      ]}
    >
      <CreateZoneForm />
    </LayoutContent>
  )
}
