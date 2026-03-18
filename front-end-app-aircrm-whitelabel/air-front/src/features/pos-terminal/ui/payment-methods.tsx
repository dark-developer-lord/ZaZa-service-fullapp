import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  FormControlLabel,
  Checkbox,
  TextField,
  Stack,
  CircularProgress,
  Alert,
  Avatar
} from '@mui/material'

import { useCartStore } from '../model/cart-store'
import { useGetAvailableWallets } from '../api/get-available-wallets'
import { useGetCartTotal } from '@widgets/pos-terminal/cart/lib/get-cart-total'
import { useGetCartDiscount } from '@widgets/pos-terminal/cart/lib/get-cart-discount'

export const PaymentMethods = () => {
  const [
    isInstallment,
    initialPayment,
    delivery,
    pointsToUse,
    selectedPaymentMethods,
    paymentAmounts,
    setSelectedPaymentMethods,
    setPaymentAmount,
    clearPaymentMethods
  ] = useCartStore((state) => [
    state.isInstallment,
    state.initialPayment,
    state.delivery,
    state.pointsToUse,
    state.selectedPaymentMethods,
    state.paymentAmounts,
    state.setSelectedPaymentMethods,
    state.setPaymentAmount,
    state.clearPaymentMethods
  ])

  const { data: walletsResponse, isLoading, error } = useGetAvailableWallets()
  const wallets = (walletsResponse?.wallets || []).filter(wallet => wallet.type !== 'personal')

  const totalAmount = useGetCartTotal()
  const productDiscount = useGetCartDiscount()
  const pointsDiscount = pointsToUse || 0

  const baseAmount = (totalAmount ?? 0) - productDiscount - pointsDiscount + (delivery ?? 0)
  const targetAmount = Number(isInstallment ? (initialPayment || 0) : baseAmount) || 0

  const paymentMethodsEnabled = !isInstallment || (isInstallment && initialPayment > 0)

  const handlePaymentMethodChange = (walletId: number, checked: boolean) => {
    if (!paymentMethodsEnabled) return

    let newSelectedMethods: number[]
    
    if (checked) {
      newSelectedMethods = [...selectedPaymentMethods, walletId]
    } else {
      newSelectedMethods = selectedPaymentMethods.filter(id => id !== walletId)
      const newAmounts = { ...paymentAmounts }
      delete newAmounts[walletId]
      setPaymentAmount(walletId, 0)
    }

    setSelectedPaymentMethods(newSelectedMethods)

    if (newSelectedMethods.length === 1) {
      setPaymentAmount(newSelectedMethods[0], targetAmount || 0)
    } else if (newSelectedMethods.length > 1) {
      const amountPerMethod = Math.round(((targetAmount || 0) / newSelectedMethods.length) * 100) / 100
      newSelectedMethods.forEach(methodId => {
        if (!paymentAmounts[methodId]) {
          setPaymentAmount(methodId, amountPerMethod)
        }
      })
    }
  }

  const handleAmountChange = (walletId: number, value: string) => {
    const numericValue = parseFloat(value) || 0
    setPaymentAmount(walletId, numericValue)
  }

  const totalPaymentAmount = Number(selectedPaymentMethods.reduce((sum, walletId) => {
    return sum + (Number(paymentAmounts[walletId]) || 0)
  }, 0)) || 0

  const isValidAmount = Math.abs(totalPaymentAmount - targetAmount) < 0.01
  useEffect(() => {
    if (!paymentMethodsEnabled) {
      clearPaymentMethods()
    }
  }, [paymentMethodsEnabled, clearPaymentMethods])

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2 }}>
        <CircularProgress size={20} />
        <Typography variant="body2" color="text.secondary">
          Загружаем способы оплаты...
        </Typography>
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        Ошибка при загрузке способов оплаты
      </Alert>
    )
  }

  if (wallets.length === 0) {
    return (
      <Alert severity="info" sx={{ my: 2 }}>
        Нет доступных способов оплаты
      </Alert>
    )
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
        Способы оплаты
      </Typography>

      {!paymentMethodsEnabled && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {isInstallment 
            ? 'Установите первоначальный взнос для выбора способов оплаты'
            : 'Способы оплаты недоступны'
          }
        </Alert>
      )}

      <Stack spacing={2}>
        {wallets.map((wallet) => {
          const isSelected = selectedPaymentMethods.includes(wallet.wallet_id)
          const amount = paymentAmounts[wallet.wallet_id] || 0
          const isInputDisabled = !paymentMethodsEnabled || selectedPaymentMethods.length === 1

          return (
            <Box key={wallet.wallet_id}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isSelected}
                    onChange={(e) => handlePaymentMethodChange(wallet.wallet_id, e.target.checked)}
                    disabled={!paymentMethodsEnabled}
                    sx={{
                      '& .MuiSvgIcon-root': {
                        borderRadius: '50%',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                        '&:hover': {
                          transform: 'scale(1.05)',
                        }
                      },
                      '&.Mui-checked .MuiSvgIcon-root': {
                        animation: 'checkboxPulse 0.3s ease-out',
                      },
                      '@keyframes checkboxPulse': {
                        '0%': {
                          transform: 'scale(1)',
                        },
                        '50%': {
                          transform: 'scale(1.2)',
                        },
                        '100%': {
                          transform: 'scale(1.1)',
                        }
                      }
                    }}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      src={import.meta.env.VITE_APP_BACK_URL + '/' + wallet.logo || '/wallet.svg'}
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: 'grey.100',
                        '& img': {
                          objectFit: 'contain',
                          width: '100%',
                          height: '100%'
                        }
                      }}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography>{wallet.name}</Typography>
                      {wallet.is_enabled && (
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: 'success.main'
                          }}
                        />
                      )}
                    </Box>
                  </Box>
                }
              />
              
              {isSelected && (
                <TextField
                  size="small"
                  type="number"
                  label="Сумма"
                  value={amount}
                  onChange={(e) => handleAmountChange(wallet.wallet_id, e.target.value)}
                  disabled={isInputDisabled}
                  sx={{
                    ml: 4,
                    mt: 1,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1
                    }
                  }}
                  inputProps={{
                    min: 0,
                    max: targetAmount,
                    step: 0.01
                  }}
                />
              )}
            </Box>
          )
        })}

        {selectedPaymentMethods.length > 1 && (
          <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Сумма к оплате: {targetAmount.toFixed(2)} с.
            </Typography>
            <Typography
              variant="body2"
              color={isValidAmount ? 'success.main' : 'error.main'}
              sx={{ fontWeight: 'bold' }}
            >
              Итого по способам: {totalPaymentAmount.toFixed(2)} с.
            </Typography>
            {!isValidAmount && (
              <Typography variant="caption" color="error.main">
                Сумма должна равняться {targetAmount.toFixed(2)} с.
              </Typography>
            )}
          </Box>
        )}
      </Stack>
    </Box>
  )
}
