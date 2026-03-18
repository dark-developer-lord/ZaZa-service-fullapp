import * as yup from 'yup'

export const schema = yup.object().shape({
  email: yup.string().email('Введите валидный email').required('Введите email'),
  password: yup.string().required('Введите пароль'),
  remember: yup.boolean(),
})

export type Dto = yup.InferType<typeof schema>
