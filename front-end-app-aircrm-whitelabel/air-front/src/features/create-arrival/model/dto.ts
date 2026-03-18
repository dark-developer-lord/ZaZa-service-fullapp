import * as yup from 'yup'

import { transformNumber } from '@shared/lib'

const productShape = yup.object().shape({
  product_id: yup
    .number()
    .transform(transformNumber)
    .nullable(),
  product_name: yup
    .string()
    .required('Введите название товара'),
  image: yup
    .string()
    .nullable(),
  category_id: yup
    .number()
    .transform(transformNumber)
    .nullable(),
  sub_category_id: yup
    .number()
    .transform(transformNumber)
    .nullable(),
  has_variations: yup
    .boolean()
    .default(false),
  product_code: yup
    .string()
    .nullable(),
  purchase_price: yup
    .number()
    .transform(transformNumber)
    .required('Выберите цену'),
  retail_price: yup
    .number()
    .transform(transformNumber)
    .required('Введите цену'),
  quantity:  yup
    .number()
    .transform(transformNumber)
    .required('Введите количество'),
})

const baseShape = {
  name: yup
    .string()
    .max(191, 'Максимальная длина 191 символ')
    .required('Введите название'),
  counterparty_id: yup
    .number()
    .transform(transformNumber)
    .required('Выберите поставщика'),
  counterparty_name: yup
    .string()
    .nullable(),
  contact: yup
    .string()
    .nullable(),
  company_name: yup
    .string()
    .nullable(),
  address: yup
    .string()
    .nullable(),
  inn: yup
    .string()
    .nullable(),
  status: yup
    .string()
    .nullable(),
  warehouse_id: yup
    .number()
    .transform(transformNumber)
    .required('Выберите склад'),
  products: yup.array().of(productShape)
}

export const createSchema = yup.object().shape({
  ...baseShape,
})

export type ArrivalDto = yup.InferType<typeof createSchema>
export type CreateDto = ArrivalDto
export type UpdateArrivalDto = ArrivalDto
