import { IconButton, Tooltip } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

import { TransactionApproval } from '../api/get-transaction-approvals'
import { useApproveTransactionStore } from '@features/finance/approve-transaction'

interface ApprovalActionsProps {
  row: TransactionApproval
}

export const ApprovalActions = ({ row }: ApprovalActionsProps) => {
  const openApprove = useApproveTransactionStore((state) => state.openApprove)

  const handleApprove = () => {
    openApprove(row)
  }

  return (
    <Tooltip title="Одобрить">
      <IconButton
        onClick={handleApprove}
        disabled={!row.can_approve}
        sx={{
          color: row.can_approve ? 'success.main' : 'action.disabled',
          '&:hover': {
            bgcolor: row.can_approve ? 'success.light' : 'transparent',
          },
        }}
      >
        <CheckCircleIcon />
      </IconButton>
    </Tooltip>
  )
}

