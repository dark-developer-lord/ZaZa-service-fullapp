import * as yup from 'yup'

// Schema for updating transaction schedule
export const updateTransactionScheduleSchema = yup.object().shape({
  transaction_type: yup.mixed()
    .test('is-required', 'Тип транзакции обязателен для выбора', (value) => {
      return value !== '' && value !== null && value !== undefined
    })
    .required('Тип транзакции обязателен для выбора'),
  amount: yup.number()
    .transform((value, originalValue) => {
      if (originalValue === '' || originalValue === null) return 0
      return value
    })
    .required('Сумма обязательна для заполнения')
    .positive('Сумма должна быть больше нуля'),
})

export type UpdateTransactionScheduleDto = yup.InferType<typeof updateTransactionScheduleSchema>

// Schema for approving transaction
export const approveTransactionSchema = yup.object().shape({
  wallet_id: yup.number()
    .transform((value, originalValue) => {
      if (typeof originalValue === 'string') {
        const parsed = parseInt(originalValue, 10)
        return isNaN(parsed) ? 0 : parsed
      }
      if (originalValue === '' || originalValue === null) return 0
      return value
    })
    .required('Кошелек обязателен для выбора')
    .positive('Кошелек обязателен для выбора'),
  approval_date: yup.string()
    .required('Дата одобрения обязательна'),
  description: yup.string()
    .nullable()
    .transform((value, originalValue) => {
      if (originalValue === '' || originalValue === null || originalValue === undefined) return null
      return value
    }),
})

export type ApproveTransactionDto = yup.InferType<typeof approveTransactionSchema>

