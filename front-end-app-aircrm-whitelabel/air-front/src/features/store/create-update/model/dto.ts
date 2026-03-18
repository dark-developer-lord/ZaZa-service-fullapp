import * as yup from 'yup'

import { transformNumber } from '@shared/lib'

const baseSchema = {
  name: yup.string().required('Введите название магазина'),
  address: yup.string().required('Введите адрес'),
  responsible_name: yup.string().required('Введите ФИО'),
  responsible_phone: yup.string().checkPhone().required('Введите номер телефона'),
  email: yup
    .string()
    .email('Введите корректный email')
    .required('Введите email'),
}

const storeInfoSchema = yup.object().shape({
  name: yup.string().required('Введите адрес'),
  tax: yup
    .number()
    .transform(transformNumber),
  minimum_delivery_time: yup
    .number()
    .transform(transformNumber),
  maximum_delivery_time: yup
    .number()
    .transform(transformNumber)
})

const storeAddressSchema = yup.object().shape({
  address: yup.string().required('Введите адрес'),
  map_link: yup.string().nullable(),
  latitude: yup
    .number()
    .transform(transformNumber)
    .nullable(),
  longitude: yup
    .number()
    .transform(transformNumber)
    .nullable(),
})

const storeResponsibleSchema = yup.object().shape({
  responsible_name: yup.string().required('Введите ФИО'),
  responsible_phone: yup.string().checkPhone().required('Введите номер телефона'),
})

export const storeSchema = [
  storeInfoSchema,
  storeAddressSchema,
  storeResponsibleSchema
]

export const updateStoreSchema = yup.object().shape({
  name: yup.string().required('Введите адрес'),
  tax: yup
    .number()
    .transform(transformNumber)
    .required('Введите НДС'),
  minimum_delivery_time: yup
    .number()
    .transform(transformNumber)
    .required('Введите минимальное время доставки'),
  maximum_delivery_time: yup
    .number()
    .transform(transformNumber)
    .required('Введите максимальное время доставки'),
  address: yup.string().required('Введите адрес'),
  map_link: yup.string().nullable(),
  latitude: yup
    .number()
    .transform(transformNumber)
    .nullable(),
  longitude: yup
    .number()
    .transform(transformNumber)
    .nullable(),
  responsible_name: yup.string().required('Введите ФИО'),
  responsible_phone: yup.string().checkPhone().required('Введите номер телефона'),
})

export const createSchema = yup.object().shape({
  ...baseSchema,
  password: yup
    .string()
    .min(6, 'Пароль должен быть не менее 6 символов')
    .max(32, 'Пароль должен быть не более 20 символов')
    .required('Введите пароль'),
})


export type CreateDto = yup.InferType<typeof createSchema>

export const updateSchema = yup.object().shape({
  ...baseSchema,
  password: yup
    .string()
    .transform((o, c) => (o === '' ? null : c))
    .min(6, 'Пароль должен быть не менее 6 символов')
    .max(32, 'Пароль должен быть не более 20 символов')
    .nullable()
})

export type UpdateDto = yup.InferType<typeof updateSchema>
