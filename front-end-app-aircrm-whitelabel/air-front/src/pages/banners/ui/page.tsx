import { Banners } from '@widgets/banners'
import { LayoutContent } from '@widgets/layout'
import {
  CreateBannerButton,
  CreateBannerDialog,
  UpdateBannerDialog,
} from '@features/banners'

export const Page = () => {
  return (
    <LayoutContent
      title="Баннеры"
      breadcrumbs={[
        {
          label: 'Баннеры',
          name: 'banners',
        },
      ]}
      rightSlot={<CreateBannerButton />}
    >
      <CreateBannerDialog />
      <UpdateBannerDialog />
      <Banners />
    </LayoutContent>
  )
}
