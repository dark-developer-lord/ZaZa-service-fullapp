import { CampaignActions, CampaignStatusToggle } from '@features/campaigns'
import { CampaignsTable, useGetCampaigns } from '@entities/campaign'
import { Board } from '@shared/ui'

export const Ui = () => {
  const { data, isFetching, error } = useGetCampaigns()

  return (
    <Board>
      <CampaignsTable
        loading={isFetching}
        rows={data?.data || []}
        Actions={CampaignActions}
        StatusToggle={CampaignStatusToggle}
        error={error}
      />
    </Board>
  )
}
