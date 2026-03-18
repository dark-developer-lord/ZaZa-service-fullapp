import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Fade,
  Slide
} from '@mui/material'
import { TransitionProps } from '@mui/material/transitions'
import { forwardRef } from 'react'
import { Warning } from '@mui/icons-material'

import { Wallet } from '../api/get-wallets'
import { useDeactivateWallet } from '../api/wallet-actions'

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />
})

interface DeactivateWalletModalProps {
  open: boolean
  onClose: () => void
  wallet: Wallet | null
}

export const DeactivateWalletModal = ({ open, onClose, wallet }: DeactivateWalletModalProps) => {
  const deactivateWallet = useDeactivateWallet()

  const handleDeactivate = () => {
    if (!wallet) return
    
    deactivateWallet.mutate(
      { wallet_id: wallet.wallet_id },
      {
        onSuccess: () => {
          onClose()
        }
      }
    )
  }

  if (!wallet) return null

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 1,
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
        }
      }}
    >
      <Fade in={open} timeout={300}>
        <Box>
          <DialogTitle sx={{ pb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Warning color="warning" />
              <Typography variant="h6" fontWeight="bold">
                Деактивировать кошелек
              </Typography>
            </Box>
          </DialogTitle>

          <DialogContent sx={{ pt: 2 }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Вы уверены, что хотите деактивировать кошелек <strong>"{wallet.name}"</strong>?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              После деактивации кошелек будет отключен и станет недоступен для использования.
            </Typography>
          </DialogContent>

          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button
              onClick={onClose}
              disabled={deactivateWallet.isLoading}
              sx={{
                borderRadius: 1,
                px: 3,
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }
              }}
            >
              Отмена
            </Button>
            <Button
              onClick={handleDeactivate}
              variant="contained"
              color="error"
              disabled={deactivateWallet.isLoading}
              sx={{
                borderRadius: 1,
                px: 3,
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(244, 67, 54, 0.3)'
                },
                '&:disabled': {
                  opacity: 0.6
                }
              }}
            >
              {deactivateWallet.isLoading ? 'Деактивация...' : 'Деактивировать'}
            </Button>
          </DialogActions>
        </Box>
      </Fade>
    </Dialog>
  )
}
