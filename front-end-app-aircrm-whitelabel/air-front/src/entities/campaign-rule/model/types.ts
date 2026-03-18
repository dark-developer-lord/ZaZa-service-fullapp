import { RuleType } from '../lib/rule-type-labels'

export interface CampaignRule {
  id: number
  rule_type: RuleType
  criteria: {
    bonus: number
    total_amount?: number
  }
  status: boolean
  description: string
}
