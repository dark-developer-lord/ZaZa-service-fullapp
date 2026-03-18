import * as yup from 'yup'

import { transformNumber } from '@shared/lib'

const baseSchema = {
  f_name: yup.string().required('Введите имя'),
  l_name: yup.string().required('Введите фамилию'),
  image: yup.mixed().required('Выберите изображение'),
  role_id: yup.number().transform(transformNumber).required('Выберите роль'),
  email: yup.string().email().required('Введите email'),
  phone: yup.string().checkPhone().required('Введите телефон'),
  password: yup
    .string()
    .min(6, 'Пароль должен быть не менее 6 символов')
    .max(32, 'Пароль должен быть не более 20 символов')
    .required('Введите пароль'),
}

export const createSchema = yup.object().shape({
  ...baseSchema,
})

export type CreateDto = yup.InferType<typeof createSchema>

export const updateSchema = yup.object().shape({
  ...baseSchema,
  image: yup.mixed().nullable(),
  password: yup
    .string()
    .transform((o, c) => (o === '' ? null : c))
    .min(6, 'Пароль должен быть не менее 6 символов')
    .max(32, 'Пароль должен быть не более 20 символов')
    .nullable(),
})

export type UpdateDto = yup.InferType<typeof updateSchema>
