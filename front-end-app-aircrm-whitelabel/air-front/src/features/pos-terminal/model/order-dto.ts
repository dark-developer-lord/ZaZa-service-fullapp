import * as yup from 'yup'

export const orderDto = yup.object().shape({
  customer_id: yup.number().optional(),
  delivery_address: yup.string().optional(),
  restaurant_id: yup.string().required('Выберите ресторан'),
  on_installment: yup.boolean().optional(),
  initial_payment: yup.number().optional(),
  debt_due_date: yup.string().optional(),
  foods: yup
    .array()
    .of(
      yup.object().shape({
        id: yup.number().required('Выберите блюдо'),
        quantity: yup.number().required('Укажите количество'),
        variation: yup.object().nullable(),
        add_ons: yup.array().of(yup.number().required()).nullable(),
      }),
    )
    .required('Выберите блюда'),
})

export type OrderDto = yup.InferType<typeof orderDto>
