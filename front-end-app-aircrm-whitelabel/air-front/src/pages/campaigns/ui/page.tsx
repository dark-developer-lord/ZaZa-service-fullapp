import { Campaigns } from '@widgets/campaigns'
import { LayoutContent } from '@widgets/layout'
import {
  CreateCampaignButton,
  CreateCampaignDialog,
  UpdateCampaignDialog,
} from '@features/campaigns'

export const Page = () => {
  return (
    <LayoutContent
      title="Промоакции"
      breadcrumbs={[
        {
          label: 'Промоакции',
          name: 'campaigns',
        },
      ]}
      rightSlot={<CreateCampaignButton />}
    >
      <CreateCampaignDialog />
      <UpdateCampaignDialog />
      <Campaigns />
    </LayoutContent>
  )
}
