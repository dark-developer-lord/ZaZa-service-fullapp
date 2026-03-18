import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
  Typography,
  TextField,
  MenuItem,
  CircularProgress,
} from '@mui/material'
import { useMutation, useQueryClient } from 'react-query'
import { toast } from 'react-hot-toast'
import GridCloseIcon from '@icons/close.svg?react'
import { Wallet } from '../api/get-wallets'
import { useGetAvailableWallets } from '@features/pos-terminal/api/get-available-wallets'
import { postQuery } from '@shared/api'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'

interface TransferBetweenWalletsModalProps {
  open: boolean
  onClose: () => void
  sourceWallet: Wallet | null
}

export const TransferBetweenWalletsModal = ({ open, onClose, sourceWallet }: TransferBetweenWalletsModalProps) => {
  const [targetWalletId, setTargetWalletId] = useState<number | ''>('')
  const [amount, setAmount] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  
  const { data: walletsData } = useGetAvailableWallets()
  const queryClient = useQueryClient()

  const { mutate: transferMoney, isLoading } = useMutation({
    mutationFn: postQuery('/vendor/transaction/wallet-transactions'),
    onSuccess: () => {
      toast.success('Перевод успешно выполнен')
      // Refetch wallets to update balances
      queryClient.invalidateQueries(['wallets'])
      // Refetch wallet transactions for both source and target wallets
      queryClient.invalidateQueries(['wallet-transactions'])
      // Refetch financial calendar if it exists
      queryClient.invalidateQueries(['financial-calendar'])
      handleClose()
    },
    onError: () => {
      toast.error('Ошибка при переводе средств')
    },
  })

  const handleClose = () => {
    setTargetWalletId('')
    setAmount('')
    setDescription('')
    onClose()
  }

  const handleSubmit = () => {
    if (!sourceWallet || !targetWalletId || !amount) {
      toast.error('Заполните все обязательные поля')
      return
    }

    const numericAmount = parseFloat(amount)
    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast.error('Введите корректную сумму')
      return
    }

    transferMoney({
      from_wallet_id: sourceWallet.wallet_id,
      to_wallet_id: targetWalletId,
      amount: numericAmount,
      description: description || `Перевод из ${sourceWallet.name}`,
    })
  }

  const wallets = walletsData?.wallets || []
  const availableWallets = wallets.filter(
    (w) => w.is_enabled && w.wallet_id !== sourceWallet?.wallet_id
  )

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          minWidth: { xs: 'calc(100vw - 32px)', sm: 400 },
          maxWidth: { xs: 'calc(100vw - 32px)', sm: 500 },
          m: { xs: 2, sm: 'auto' },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 2,
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SwapHorizIcon color="primary" />
          <Typography variant="h6" component="div">
            Перевод между кошельками
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small">
          <GridCloseIcon width={24} height={24} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Source Wallet (Read-only) */}
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
              Из кошелька
            </Typography>
            <Box
              sx={{
                p: 2,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                bgcolor: 'action.hover',
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}
            >
              {sourceWallet?.logo && (
                <Box
                  component="img"
                  src={`${import.meta.env.VITE_APP_BACK_URL}/${sourceWallet.logo}`}
                  alt={sourceWallet.name}
                  sx={{ width: 32, height: 32, borderRadius: '50%' }}
                />
              )}
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {sourceWallet?.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Баланс: {sourceWallet?.total_amount.toLocaleString()} с.
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Target Wallet Selector */}
          <TextField
            select
            label="В кошелек"
            value={targetWalletId}
            onChange={(e) => setTargetWalletId(Number(e.target.value))}
            fullWidth
            required
            disabled={isLoading}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
          >
            {availableWallets.length === 0 ? (
              <MenuItem disabled>Нет доступных кошельков</MenuItem>
            ) : (
              availableWallets.map((wallet) => (
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
                      <Typography variant="body2">{wallet.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {wallet.total_amount.toLocaleString()} с.
                      </Typography>
                    </Box>
                  </Box>
                </MenuItem>
              ))
            )}
          </TextField>

          {/* Amount Input */}
          <TextField
            label="Сумма"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            fullWidth
            required
            disabled={isLoading}
            inputProps={{ min: 0, step: 0.01 }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
            helperText={
              sourceWallet && amount && parseFloat(amount) > sourceWallet.total_amount
                ? 'Сумма превышает доступный баланс'
                : ''
            }
            error={sourceWallet ? parseFloat(amount) > sourceWallet.total_amount : false}
          />

          {/* Description Input */}
          <TextField
            label="Комментарий (необязательно)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={2}
            disabled={isLoading}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
            placeholder="Добавьте комментарий к переводу"
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2.5, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Button onClick={handleClose} disabled={isLoading} color="inherit">
          Отмена
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={
            isLoading ||
            !targetWalletId ||
            !amount ||
            parseFloat(amount) <= 0 ||
            (sourceWallet ? parseFloat(amount) > sourceWallet.total_amount : false)
          }
          startIcon={isLoading ? <CircularProgress size={16} /> : <SwapHorizIcon />}
        >
          {isLoading ? 'Перевод...' : 'Перевести'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

