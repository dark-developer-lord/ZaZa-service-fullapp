import * as yup from 'yup'

const baseSchema = {
  f_name: yup.string().required('Введите имя'),
  l_name: yup.string().required('Введите фамилию'),
  image: yup.mixed().nullable(),
  phone: yup
    .string()
    .test('phone-format', 'Номер должен начинаться с +992 и содержать 9 цифр', (value) => {
      if (!value) return false
      // Remove all spaces and check if it matches +992 followed by exactly 9 digits
      const cleanPhone = value.replace(/\s/g, '')
      return /^\+992\d{9}$/.test(cleanPhone)
    })
    .required('Введите телефон'),
  password: yup
    .string()
    .min(6, 'Пароль должен быть не менее 6 символов')
    .max(32, 'Пароль должен быть не более 20 символов')
    .required('Введите пароль'),
  modules: yup
    .array()
    .of(yup.string())
    .min(1, 'Выберите хотя бы один модуль')
    .required('Выберите модули'),
}

export const createSchema = yup.object().shape({
  ...baseSchema,
})

export type CreateDto = yup.InferType<typeof createSchema>

export const updateSchema = yup.object().shape({
  ...baseSchema,
  password: yup
    .string()
    .transform((o, c) => (o === '' ? null : c))
    .min(6, 'Пароль должен быть не менее 6 символов')
    .max(32, 'Пароль должен быть не более 20 символов')
    .nullable(),
})

export type UpdateDto = yup.InferType<typeof updateSchema>
