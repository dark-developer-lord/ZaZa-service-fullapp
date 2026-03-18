export enum CampaignRuleType {
  combo = 'combo',
  total_order = 'total_order',
  complete_campaigns = 'complete_campaigns',
}

export type RuleType = keyof typeof CampaignRuleType

export const ruleTypeLabels: Record<RuleType, string> = {
  combo: 'Комбо',
  total_order: 'Сумма заказа',
  complete_campaigns: 'Выполнение акций',
}
