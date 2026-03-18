import * as yup from 'yup'

export const schema = yup.object().shape({
  login: yup.string().required('Введите email или телефон'),
  password: yup.string().required('Введите пароль'),
  remember: yup.boolean(),
})

export type Dto = yup.InferType<typeof schema>
