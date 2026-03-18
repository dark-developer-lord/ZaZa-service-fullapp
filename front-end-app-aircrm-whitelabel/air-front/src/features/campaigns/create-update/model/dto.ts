import * as yup from 'yup'

import { CampaignRuleType } from '@entities/campaign-rule'
import { transformNumber } from '@shared/lib'

const baseSchema = {
  title: yup.string().required('Введите заголовок акции'),
  image: yup.mixed().required('Выберите изображение'),
  status: yup.boolean().required('Выберите статус акции'),
  start_date: yup.string().required('Выберите дату начала акции'),
  end_date: yup.string().required('Выберите дату окончания акции'),
  start_time: yup.string().required('Выберите время начала акции'),
  end_time: yup.string().required('Выберите время окончания акции'),
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
  restaurant_ids: yup
    .array()
    .of(yup.number().required())
    .required('Выберите ресторан'),
}

export const createSchema = yup.object().shape({
  ...baseSchema,
})

export type CreateDto = yup.InferType<typeof createSchema>

export const updateSchema = yup.object().shape({
  ...baseSchema,
  image: yup.mixed().nullable(),
  rule_type: yup.string().nullable(),
  bonus: yup.string().nullable(),
  total_amount: yup.string().nullable(),
  restaurant_ids: yup.array().of(yup.number().nullable()).nullable(),
})

export type UpdateDto = yup.InferType<typeof updateSchema>
