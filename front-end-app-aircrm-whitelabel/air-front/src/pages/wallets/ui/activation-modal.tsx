import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
} from '@mui/material'

import GridCloseIcon from '@icons/close.svg?react'
import { useActivateWallet } from '../api/wallet-actions'
import { Wallet } from '../api/get-wallets'

interface ActivationModalProps {
  open: boolean
  onClose: () => void
  wallet: Wallet | null
}

export const ActivationModal = ({ open, onClose, wallet }: ActivationModalProps) => {
  const activateWallet = useActivateWallet()

  const handleActivate = () => {
    if (!wallet) return

    activateWallet.mutate(
      { wallet_id: wallet.wallet_id },
      {
        onSuccess: () => {
          onClose()
        }
      }
    )
  }

  const handleClose = () => {
    onClose()
  }

  if (!wallet) return null

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
          maxWidth: { xs: 'calc(100vw - 32px)', sm: 450 },
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
        Активация кошелька
        <IconButton onClick={handleClose} size="small">
          <GridCloseIcon width={24} height={24} />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ py: 3 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              mx: 'auto',
              mb: 2,
              borderRadius: '50%',
              bgcolor: 'primary.50',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src={wallet.logo ? `${import.meta.env.VITE_APP_BACK_URL}/${wallet.logo}` : '/icons/wallet.svg'}
              alt="wallet"
              style={{
                width: 32,
                height: 32,
                objectFit: 'contain'
              }}
            />
          </Box>
          
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
            {wallet.name}
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Вы уверены, что хотите активировать этот кошелек?
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          variant="outlined"
          onClick={handleClose}
          disabled={activateWallet.isLoading}
          sx={{
            flex: 1,
            borderColor: 'primary.main',
            color: 'primary.main',
            '&:hover': {
              borderColor: 'primary.dark',
              backgroundColor: 'primary.50',
            },
          }}
        >
          Отмена
        </Button>
        <Button
          variant="contained"
          onClick={handleActivate}
          disabled={activateWallet.isLoading}
          sx={{
            flex: 1,
            ml: 2,
            backgroundColor: 'primary.main',
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
          }}
        >
          {activateWallet.isLoading ? 'Активация...' : 'Активировать'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
