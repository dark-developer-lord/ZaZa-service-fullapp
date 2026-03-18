import {
  CampaignRuleActions,
  CampaignRuleStatusToggle,
} from '@features/campaign-rules'
import {
  CampaignRulesTable,
  useGetCampaignRules,
} from '@entities/campaign-rule'
import { Board } from '@shared/ui'

export const Ui = () => {
  const { data, isFetching, error } = useGetCampaignRules()

  return (
    <Board>
      <CampaignRulesTable
        loading={isFetching}
        rows={data?.data || []}
        Actions={CampaignRuleActions}
        StatusToggle={CampaignRuleStatusToggle}
        error={error}
      />
    </Board>
  )
}
