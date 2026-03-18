import * as yup from 'yup'

import { transformNumber } from '@shared/lib'

const baseShape = {
  name: yup
    .string()
    .max(191, 'Максимальная длина 191 символ')
    .required('Введите название'),
  category_id: yup
    .number()
    .transform(transformNumber)
    .required('Выберите категорию'),
  sub_category_id: yup.number().transform(transformNumber).nullable(),
  variation_type: yup
    .number()
    .transform(transformNumber)
    .required('Выберите тип вариации'),
  // These fields are optional when variations exist (will be calculated from variation_details)
  purchase_price: yup.number().transform(transformNumber).nullable(),
  price: yup.number().transform(transformNumber).nullable(),
  quantity: yup.number().transform(transformNumber).nullable(),
  product_code: yup.string().nullable(),
  discount: yup
    .number()
    .min(0, 'Скидка не может быть меньше 0')
    .max(100, 'Скидка не может быть больше 100')
    .required('Введите скидку'),
  discount_type: yup
    .mixed()
    .oneOf(['percent', 'amount'], 'Выберите тип скидки')
    .required('Введите скидку'),
  description: yup
    .string()
    .max(1000, 'Максимальная длина 1000 символов')
    .nullable(),
  attribute_id: yup.array().of(yup.number().required()).nullable(),
  choice_no: yup.array().of(yup.number().required()).nullable(),
  choice: yup.array().of(yup.string().required()).nullable(),
  // New variation fields
  variation_name: yup.string().nullable(),
  variation_types: yup.array().of(yup.string().required()).nullable(),
  variation_details: yup.object().nullable(),
  // Document processing fields
  counterparty_id: yup.number().transform(transformNumber).nullable(),
}

export const createSchema = yup.object().shape({
  ...baseShape,
  image: yup.mixed().nullable(),
  warehouse_id: yup
    .number()
    .transform(transformNumber)
    .required('Выберите склад'),
})

export const updateSchema = yup.object().shape({
  ...baseShape,
  image: yup.mixed().nullable(),
})

export type CreateDto = yup.InferType<typeof createSchema>
export type UpdateDto = yup.InferType<typeof updateSchema>

// Alias for backward compatibility
export type CreateProductDto = CreateDto