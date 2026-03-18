import * as yup from 'yup'

const baseSchema = {
  name: yup.string().required('Введите название'),
  address: yup.string().required('Введите адрес'),
  responsible: yup.string().required('Введите имя'),
  phone: yup.string().checkPhone().required('Введите номер телефона'),
  owner_name: yup.string().nullable(),
  owner_phone: yup.string().nullable(),
  email: yup.string().email('Введите корректный email').nullable(),
}

export const createSchema = yup.object().shape({
  ...baseSchema,
})

export type CreateDto = yup.InferType<typeof createSchema>

export const updateSchema = yup.object().shape({
  ...baseSchema,
  password: yup
    .string()
    .min(6, 'Пароль должен быть не менее 6 символов')
    .max(32, 'Пароль должен быть не более 20 символов')
    .nullable()
})

export type UpdateDto = yup.InferType<typeof updateSchema>
