import * as yup from 'yup'

import { CampaignRuleType } from '@entities/campaign-rule'
import { transformNumber } from '@shared/lib'

export const createSchema = yup.object().shape({
  rule_type: yup
    .string()
    .oneOf(Object.keys(CampaignRuleType))
    .required('Введите тип правила'),
  bonus: yup
    .number()
    .transform(transformNumber)
    .min(1, 'Бонус должен быть не меньше 1')
    .required('Введите бонус'),
  total_amount: yup
    .number()
    .when('rule_type', {
      is: CampaignRuleType.total_order,
      then: (s: yup.NumberSchema) => s.required('Введите сумму'),
      otherwise: (s: yup.NumberSchema) => s.nullable(),
    })
    .transform(transformNumber)
    .min(1, 'Сумма должна быть не меньше 1'),
  description: yup.string().required('Введите описание'),
})

export type CreateDto = yup.InferType<typeof createSchema>
