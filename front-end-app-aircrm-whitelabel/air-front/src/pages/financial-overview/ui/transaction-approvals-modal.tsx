import { Dialog, DialogTitle, DialogContent, Typography, Box, Stack, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

import { DataTable } from '@shared/ui'
import { useGetTransactionApprovals, TransactionApproval } from '../api/get-transaction-approvals'
import { columns } from '../model/approval-columns'
import { ApprovalActions } from './approval-actions'
import { ApproveDialog } from '@features/finance/approve-transaction'

interface TransactionApprovalsModalProps {
  open: boolean
  onClose: () => void
  selectedDate: string | null
}

const formatAmount = (amount: number) => {
  return `${amount.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} c.`
}

export const TransactionApprovalsModal = ({
  open,
  onClose,
  selectedDate,
}: TransactionApprovalsModalProps) => {
  const { data, isLoading, error } = useGetTransactionApprovals(selectedDate)

  // Format date for display
  const formattedDate = selectedDate
    ? new Date(selectedDate).toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : ''

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '90vh',
        },
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Запланированные транзакции на {formattedDate}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {/* Summary Cards */}
        {data && (
          <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
            <Box
              sx={{
                flex: 1,
                bgcolor: '#BCF0DA',
                borderRadius: 2,
                p: 2,
              }}
            >
              <Typography variant="caption" sx={{ color: '#065F46', fontWeight: 600 }}>
                Доход
              </Typography>
              <Typography variant="h6" sx={{ color: '#065F46', fontWeight: 700 }}>
                {formatAmount(data.summary.total_income_amount)}
              </Typography>
              <Typography variant="caption" sx={{ color: '#065F46', opacity: 0.8 }}>
                {data.summary.income_count} транзакций
              </Typography>
            </Box>

            <Box
              sx={{
                flex: 1,
                bgcolor: '#FBD5D5',
                borderRadius: 2,
                p: 2,
              }}
            >
              <Typography variant="caption" sx={{ color: '#991B1B', fontWeight: 600 }}>
                Расход
              </Typography>
              <Typography variant="h6" sx={{ color: '#991B1B', fontWeight: 700 }}>
                {formatAmount(data.summary.total_expense_amount)}
              </Typography>
              <Typography variant="caption" sx={{ color: '#991B1B', opacity: 0.8 }}>
                {data.summary.expense_count} транзакций
              </Typography>
            </Box>

            <Box
              sx={{
                flex: 1,
                bgcolor: '#E0E7FF',
                borderRadius: 2,
                p: 2,
              }}
            >
              <Typography variant="caption" sx={{ color: '#3730A3', fontWeight: 600 }}>
                Дивиденды
              </Typography>
              <Typography variant="h6" sx={{ color: '#3730A3', fontWeight: 700 }}>
                {formatAmount(data.summary.total_dividends_amount)}
              </Typography>
              <Typography variant="caption" sx={{ color: '#3730A3', opacity: 0.8 }}>
                {data.summary.dividends_count} транзакций
              </Typography>
            </Box>
          </Stack>
        )}

        {/* Approvals Table */}
        <DataTable<TransactionApproval>
          columns={columns(ApprovalActions)}
          rows={data?.approvals || []}
          loading={isLoading}
          error={error}
          getRowId={(row) => row.id}
          sx={{
            minHeight: 400,
          }}
        />
      </DialogContent>

      {/* Approve Dialog */}
      <ApproveDialog />
    </Dialog>
  )
}

