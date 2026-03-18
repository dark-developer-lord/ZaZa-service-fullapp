import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Divider,
  IconButton,
  MenuItem,
  CircularProgress,
} from '@mui/material'
import { useState } from 'react'
import CloseIcon from '@icons/close.svg?react'
import { useMutation } from 'react-query'
import { postQuery, getApiPaths, ApiKeys } from '@shared/api'
import toast from 'react-hot-toast'
import { useGetAvailableWallets } from '@features/pos-terminal/api/get-available-wallets'

type Props = {
  open: boolean
  onClose: () => void
  onSubmit: (amount: number) => void
  installmentId: number,
  remainingBalance: number
}

export const AcceptPaymentModal = ({ open, onClose, onSubmit, installmentId, remainingBalance }: Props) => {
  const [amount, setAmount] = useState<string>('')
  const [walletId, setWalletId] = useState<number | ''>('')

  const { data: walletsData, isLoading: walletsLoading } = useGetAvailableWallets()

  const { mutate, isLoading } = useMutation({
    mutationKey: [ApiKeys.Installments.acceptPayment],
    mutationFn: postQuery(getApiPaths().acceptInstallmentPayment),
    onSuccess: () => {
      toast.success('Платёж успешно принят')
      onSubmit(parseFloat(amount.replace(',', '.')))
      setAmount('')
      setWalletId('')
      onClose()
    },
    onError: () => {
      toast.error('Ошибка при приеме платежа')
    },
  })

  const handleConfirm = () => {
    if (!walletId) {
      toast.error('Выберите кошелек')
      return
    }

    const normalizedAmount = amount.replace(',', '.')
    const numericAmount = parseFloat(normalizedAmount)

    if (!isNaN(numericAmount) && numericAmount > 0 && numericAmount <= remainingBalance) {
      mutate({
        installment_id: installmentId,
        amount: numericAmount,
        wallet_id: walletId,
      })
    } else if (numericAmount > remainingBalance) {
      toast.error('Сумма превышает остаток долга')
    } else {
      toast.error('Введите корректную сумму')
    }
  }

  const handleAmountChange = (value: string) => {
    const regex = /^[0-9]*[.,]?[0-9]*$/

    if (regex.test(value) || value === '') {
      const commaCount = (value.match(/,/g) || []).length
      const pointCount = (value.match(/\./g) || []).length

      if (commaCount + pointCount <= 1) {
        const normalizedValue = value.replace(',', '.')
        const numericValue = parseFloat(normalizedValue)

        if (!isNaN(numericValue) && numericValue > remainingBalance) {
          setAmount(remainingBalance.toString())
        } else {
          setAmount(value)
        }
      }
    }
  }

  const wallets = walletsData?.wallets || []
  const enabledWallets = wallets.filter((w) => w.is_enabled)

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <Box display="flex" justifyContent="space-between" alignItems="center" pt={2} pr={1}>
        <DialogTitle fontWeight="bold" fontSize="h5.fontSize">Погашение долга</DialogTitle>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider />
      <DialogContent sx={{ mt: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Wallet Selector */}
          <TextField
            select
            label="Кошелек"
            value={walletId}
            onChange={(e) => setWalletId(Number(e.target.value))}
            fullWidth
            required
            disabled={walletsLoading}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
          >
            {walletsLoading ? (
              <MenuItem disabled>
                <CircularProgress size={20} />
              </MenuItem>
            ) : enabledWallets.length === 0 ? (
              <MenuItem disabled>Нет доступных кошельков</MenuItem>
            ) : (
              enabledWallets.map((wallet) => (
                <MenuItem key={wallet.wallet_id} value={wallet.wallet_id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}>
                    {wallet.logo && (
                      <Box
                        component="img"
                        src={`${import.meta.env.VITE_APP_BACK_URL}/${wallet.logo}`}
                        alt={wallet.name}
                        sx={{ width: 24, height: 24, borderRadius: '50%' }}
                      />
                    )}
                    <Box sx={{ flex: 1 }}>
                      <Box component="span">{wallet.name}</Box>
                      <Box component="span" sx={{ ml: 1, color: 'text.secondary', fontSize: '0.875rem' }}>
                        ({wallet.total_amount.toLocaleString()} с.)
                      </Box>
                    </Box>
                  </Box>
                </MenuItem>
              ))
            )}
          </TextField>

          {/* Amount Input */}
          <TextField
            autoFocus
            fullWidth
            type="text"
            label="Внесите сумму"
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            inputProps={{
              inputMode: 'decimal',
              style: {
                MozAppearance: 'textfield',
              },
            }}
            InputProps={{
              sx: {
                '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                  WebkitAppearance: 'none',
                  margin: 0,
                },
              },
            }}
            helperText={`Остаток долга: ${remainingBalance.toLocaleString()} с.`}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined" disabled={isLoading}>
          Отмена
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="success"
          disabled={isLoading || !walletId || !amount || parseFloat(amount.replace(',', '.')) <= 0}
        >
          Оплатить
        </Button>
      </DialogActions>
    </Dialog>
  )
}
