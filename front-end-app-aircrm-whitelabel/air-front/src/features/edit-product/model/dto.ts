import * as yup from 'yup'

import { transformNumber } from '@shared/lib'

export const schema = yup.object().shape({
  name: yup
    .string()
    .max(191, 'Максимальная длина 191 символ')
    .required('Введите название'),
  image: yup.mixed().nullable(),
  restaurant_id: yup
    .number()
    .transform(transformNumber)
    .required('Выберите ресторан'),
  category_id: yup
    .number()
    .transform(transformNumber)
    .required('Выберите категорию'),
  sub_category_id: yup.number().transform(transformNumber).nullable(),
  variation_type: yup
    .number()
    .transform(transformNumber)
    .required('Выберите тип вариации'),
  veg: yup
    .number()
    .transform(transformNumber)
    .required('Выберите тип продукта'),
  addon_ids: yup.array().of(yup.number().required()).nullable(),
  price: yup.number().transform(transformNumber).required('Введите цену'),
  discount: yup
    .number()
    .min(0, 'Скидка не может быть меньше 0')
    .max(100, 'Скидка не может быть больше 100')
    .required('Введите скидку'),
  discount_type: yup
    .mixed()
    .oneOf(['percent', 'fixed'], 'Выберите тип скидки')
    .required('Введите скидку'),
  description: yup
    .string()
    .max(1000, 'Максимальная длина 1000 символов')
    .nullable(),
  attribute_id: yup.array().of(yup.number().required()).nullable(),
  choice_no: yup.array().of(yup.number().required()).nullable(),
  choice: yup.array().of(yup.string().required()).nullable(),
  available_time_starts: yup
    .string()
    .required('Введите время начала заготовки'),
  available_time_ends: yup.string().required('Введите время конца заготовки'),
})

export type Dto = yup.InferType<typeof schema>
