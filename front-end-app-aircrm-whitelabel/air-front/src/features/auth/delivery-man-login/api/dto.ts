import * as yup from 'yup'

export const schema = yup.object().shape({
  phone: yup.string().checkPhone().required('Введите номер телефона'),
  password: yup.string().required('Введите пароль'),
  remember: yup.boolean(),
})

export type Dto = yup.InferType<typeof schema>& {
  telegram_user_id?: number
}
