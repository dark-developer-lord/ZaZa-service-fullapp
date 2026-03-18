import * as yup from 'yup'

import { transformNumber } from '@shared/lib'

const baseShape = {
  type: yup
    .string()
    .required('Выберите тип операции'),
  category_id: yup
    .number()
    .transform(transformNumber)
    .required('Выберите категорию'),
  subcategory_id: yup.number().transform(transformNumber).nullable(),
  wallet_id: yup
    .number()
    .transform(transformNumber)
    .required('Выберите кошелек'),
  wallet_ids: yup
    .array()
    .of(yup.number().required())
    .min(1, 'Выберите хотя бы один кошелек')
    .nullable(),
  name: yup.string().required('Введите название'),
  amount: yup.number().transform(transformNumber).required('Введите цену'),
  description: yup.string()
}

export const createSchema = yup.object().shape({
  ...baseShape,
})

export type CreateDto = yup.InferType<typeof createSchema>
