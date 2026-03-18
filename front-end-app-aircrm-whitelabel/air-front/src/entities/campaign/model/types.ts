import { CampaignRule } from '../../campaign-rule'

export interface Campaign {
  id: number
  title: string
  image: string
  start_date: string
  end_date: string
  start_time: string
  end_time: string
  status: boolean
  campaign_rule: CampaignRule
  restaurants: number[]
  description: string
}
