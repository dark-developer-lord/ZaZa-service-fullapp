import * as yup from 'yup'

const baseSchema = {
  f_name: yup.string().required('Введите имя'),
  l_name: yup.string().required('Введите фамилию'),
  identity_number: yup.string().required('Введите идентификационный номер'),
  identity_type: yup
    .string()
    .oneOf(['passport', 'nid', 'driving_license'])
    .required('Выберите тип идентификации'),
  identity_image: yup.mixed().required('Выберите изображении идентификации'),
  image: yup.mixed().required('Выберите фото профиля'),
  email: yup
    .string()
    .email('Введите корректный email')
    .required('Введите email'),
  phone: yup.string().checkPhone().required('Введите номер телефона'),
  earning: yup.number().required('Выберите тип зароботка'),
  password: yup
    .string()
    .min(6, 'Пароль должен быть не менее 6 символов')
    .max(32, 'Пароль должен быть не более 20 символов')
    .required('Введите пароль'),
}

export const createSchema = yup.object().shape({
  ...baseSchema,
  identity_image: yup.mixed().required('Выберите изображении идентификации'),
  image: yup.mixed().required('Выберите фото профиля'),
  password: yup
    .string()
    .min(6, 'Пароль должен быть не менее 6 символов')
    .max(32, 'Пароль должен быть не более 20 символов')
    .required('Введите пароль'),
})

export type CreateDto = yup.InferType<typeof createSchema>

export const updateSchema = yup.object().shape({
  ...baseSchema,
  identity_image: yup.mixed().nullable(),
  image: yup.mixed().nullable(),
  password: yup
    .string()
    .transform((o, c) => (o === '' ? null : c))
    .min(6, 'Пароль должен быть не менее 6 символов')
    .max(32, 'Пароль должен быть не более 20 символов')
    .nullable(),
})

export type UpdateDto = yup.InferType<typeof updateSchema>
