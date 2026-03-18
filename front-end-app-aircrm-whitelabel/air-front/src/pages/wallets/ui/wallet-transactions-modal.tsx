import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Button,
  Chip,
} from '@mui/material'
import GridCloseIcon from '@icons/close.svg?react'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import { useGetWalletTransactions } from '../api/get-wallet-transactions'
import { Wallet } from '../api/get-wallets'
import { TransferBetweenWalletsModal } from './transfer-between-wallets-modal'
import { customColors } from '@shared/theme/palette'

interface WalletTransactionsModalProps {
  open: boolean
  onClose: () => void
  wallet: Wallet | null
}

export const WalletTransactionsModal = ({ open, onClose, wallet }: WalletTransactionsModalProps) => {
  const { data, isLoading } = useGetWalletTransactions(wallet?.wallet_id || null, open)
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false)

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTransactionName = (transaction: any) => {
    // If transaction exists, use its name
    if (transaction.transaction?.name) {
      return transaction.transaction.name
    }
    // If it's an order, show order number
    if (transaction.order) {
      return `Заказ #${transaction.order.order_number}`
    }
    // Fallback to meta transaction name
    if (transaction.meta?.transaction_name) {
      return transaction.meta.transaction_name
    }
    return '-'
  }

  const getTransactionType = (transaction: any) => {
    // Check if it's a wallet transfer (outgoing or incoming)
    if (transaction.meta?.transfer_type === 'outgoing' || transaction.meta?.transfer_type === 'incoming') {
      return 'transfer'
    }
    // Check if it's direct transaction with type
    if (transaction.transaction?.type) {
      return transaction.transaction.type
    }
    // Check meta for transaction type
    if (transaction.meta?.transaction_type) {
      return transaction.meta.transaction_type
    }
    // Fallback: determine by amount
    return transaction.amount >= 0 ? 'income' : 'expense'
  }

  const getTypeLabel = (type: string) => {
    if (type === 'transfer') return 'Транзакция'
    if (type === 'income') return 'Доход'
    if (type === 'expense') return 'Расход'
    return type
  }

  const getTypeColor = (type: string) => {
    if (type === 'transfer') return '#3F83F8' // Blue for transfers
    if (type === 'income') return customColors.incomeStrong
    if (type === 'expense') return customColors.expense
    return '#757575'
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'success':
        return 'Успешно'
      case 'pending':
        return 'В ожидании'
      case 'failed':
        return 'Ошибка'
      default:
        return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'success.main'
      case 'pending':
        return 'warning.main'
      case 'failed':
        return 'error.main'
      default:
        return 'text.secondary'
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          minWidth: { xs: 'calc(100vw - 32px)', sm: 600 },
          maxWidth: { xs: 'calc(100vw - 32px)', sm: 800 },
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {wallet?.logo && (
            <Avatar
              src={`${import.meta.env.VITE_APP_BACK_URL}/${wallet.logo}`}
              alt={wallet.name}
              sx={{ width: 32, height: 32 }}
            />
          )}
          <Box>
            <Typography variant="h6" component="div">
              {wallet?.name || 'Кошелек'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              История транзакций
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<SwapHorizIcon />}
            onClick={() => setIsTransferModalOpen(true)}
            sx={{ borderRadius: 1 }}
          >
            Перевод
          </Button>
          <IconButton onClick={onClose} size="small">
            <GridCloseIcon width={24} height={24} />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300, p: 3 }}>
            <CircularProgress />
          </Box>
        ) : data && data.data.length > 0 ? (
          <TableContainer sx={{ maxHeight: 500 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.paper' }}>Дата</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.paper' }}>Название</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.paper' }}>Тип</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.paper' }}>Статус</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.paper' }}>Описание</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', bgcolor: 'background.paper' }}>Сумма</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.data.map((transaction) => {
                  const transactionType = getTransactionType(transaction)
                  return (
                    <TableRow
                      key={transaction.id}
                      sx={{
                        '&:hover': {
                          bgcolor: 'action.hover'
                        }
                      }}
                    >
                      <TableCell>
                        <Typography variant="body2" sx={{ fontSize: '13px' }}>
                          {formatDate(transaction.paid_at || transaction.created_at)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {getTransactionName(transaction)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getTypeLabel(transactionType)}
                          size="small"
                          sx={{
                            bgcolor: getTypeColor(transactionType),
                            color: 'white',
                            fontWeight: 500,
                            fontSize: '11px',
                            height: 24
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: '13px',
                            fontWeight: 500,
                            color: getStatusColor(transaction.status)
                          }}
                        >
                          {getStatusLabel(transaction.status)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            fontSize: '13px',
                            maxWidth: 200,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {transaction.description || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            color: transaction.amount >= 0
                              ? 'success.main'
                              : 'error.main'
                          }}
                        >
                          {transaction.amount >= 0 ? '+' : ''}
                          {transaction.amount.toLocaleString()} с.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300, p: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Нет транзакций
            </Typography>
          </Box>
        )}

        {data && data.data.length > 0 && (
          <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
            <Typography variant="caption" color="text.secondary">
              Всего транзакций: {data.meta.total}
            </Typography>
          </Box>
        )}
      </DialogContent>

      <TransferBetweenWalletsModal
        open={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        sourceWallet={wallet}
      />
    </Dialog>
  )
}

