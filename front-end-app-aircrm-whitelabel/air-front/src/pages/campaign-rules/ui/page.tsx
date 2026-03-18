import { CampaignRules } from '@widgets/campaign-rules'
import { LayoutContent } from '@widgets/layout'
import {
  CreateCampaignRuleButton,
  CreateCampaignRuleDialog,
} from '@features/campaign-rules'

export const Page = () => {
  return (
    <LayoutContent
      title="Правила акции"
      breadcrumbs={[
        {
          label: 'Правила акции',
          name: 'campaign-rules',
        },
      ]}
      rightSlot={<CreateCampaignRuleButton />}
    >
      <CreateCampaignRuleDialog />
      <CampaignRules />
    </LayoutContent>
  )
}
