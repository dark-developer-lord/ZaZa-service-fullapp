import { Box, TextField, Stack, Typography } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import dayjs from 'dayjs'
import { useRef, useEffect } from 'react'
import { Toggle } from '@shared/ui'
import { useCartStore } from '../model/cart-store'
import { useGetCartTotal } from '@widgets/pos-terminal/cart/lib/get-cart-total'
import { formatDateForAPI } from '@shared/lib'

export const InstallmentFields = () => {
  const datePickerRef = useRef<any>(null)
  const [
    isInstallment,
    setIsInstallment,
    initialPayment,
    setInitialPayment,
    debtDueDate,
    setDebtDueDate,
    customer,
  ] = useCartStore((state) => [
    state.isInstallment,
    state.setIsInstallment,
    state.initialPayment,
    state.setInitialPayment,
    state.debtDueDate,
    state.setDebtDueDate,
    state.customer,
  ])

  const totalPrice = useGetCartTotal()
  const remaining = totalPrice - (initialPayment || 0)
  const isFullPayment = initialPayment >= totalPrice && initialPayment > 0 && totalPrice > 0

  const handleInstallmentToggle = (checked: boolean) => {
    if (checked && !customer) {
      return
    }
    setIsInstallment(checked)
    if (!checked) {
      setInitialPayment(0)
      setDebtDueDate('')
    }
  }

  return (
    <Stack spacing={2} sx={{ mt: 4 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="body1" style={{fontWeight: 'bold', fontSize: '1.2rem'}}>Товар в рассрочку</Typography>
        <Toggle
            checked={isInstallment}
            onChange={(e) => handleInstallmentToggle(e.target.checked)}
            disabled={!customer}
        />
        </Box>

      {!customer && (
        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
          Выберите клиента для оформления рассрочки
        </Typography>
      )}

      {isInstallment && (
        <>
          <TextField
            label="Сумма первоначального платежа"
            type="text"
            value={initialPayment === 0 ? '' : initialPayment}
            onChange={(e) => {
              const value = e.target.value

              if (/^[1-9][0-9]*$/.test(value)) {
                const parsed = parseInt(value)
                if (parsed < totalPrice) {
                  setInitialPayment(parsed)
                }
              } else if (value === '') {
                setInitialPayment(0)
              }
            }}
            error={isFullPayment}
            helperText={isFullPayment ? 'Первоначальный платеж не может быть 100%. Это не рассрочка!' : ''}
            onKeyDown={(e) => {
              const invalidKeys = ['-', '+', 'e', '.', ',', '*', '/', '(', ')']
              if (invalidKeys.includes(e.key)) {
                e.preventDefault()
              }
            }}
            inputProps={{
              inputMode: 'numeric',
              pattern: '[1-9][0-9]*',
              style: {
                MozAppearance: 'textfield',
              },
            }}
            sx={{
              '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                WebkitAppearance: 'none',
                margin: 0,
              },
            }}
            fullWidth
          />

          <DatePicker
            ref={datePickerRef}
            label="Дата закрытия долга"
            value={debtDueDate ? dayjs(debtDueDate) : null}
            onChange={(value) => {
              if (value) {
                const formattedDate = formatDateForAPI(value)
                setDebtDueDate(formattedDate)
              } else {
                setDebtDueDate('')
              }
            }}
            minDate={dayjs()}
            slotProps={{
              textField: {
                fullWidth: true,
                onClick: () => {
                  if (datePickerRef.current) {
                    const input = datePickerRef.current.querySelector('input')
                    if (input) {
                      input.click()
                    }
                  }
                },
                inputProps: {
                  readOnly: true,
                  style: { cursor: 'pointer' }
                }
              }
            }}
          />

          <Typography variant="body2">
            Остаток долга: <strong>{remaining.toLocaleString()} сомони (Без учета доставки!)</strong>
          </Typography>
        </>
      )}
    </Stack>
  )
}
