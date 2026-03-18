import * as yup from 'yup'

export const schema = yup.object().shape({
  phone: yup.string().required('Введите номер телефона'),
  password: yup.string().required('Введите пароль'),
  remember: yup.boolean(),
})

export type Dto = yup.InferType<typeof schema>
