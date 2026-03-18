import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
  SelectChangeEvent,
} from '@mui/material'

import { useGetOrder } from '@entities/orders'
import { OrderStatus, orderStatusLabels, OrderStatusType } from '@shared/lib'

import { useChangeOrderStatus } from '../api/change-status'
import { useState } from 'react'
import { RefundReasonModal } from '@shared/ui/refund-reason-modal'

export const SelectStatus = () => {
  const { data, isFetching } = useGetOrder()
  const { changeStatus, isLoading: isLoadingStatus } = useChangeOrderStatus()

  const [modalOpen, setModalOpen] = useState(false)
  const [pendingStatus, setPendingStatus] = useState<OrderStatusType | null>(null)

  const currentStatus = data?.data.order_status

  const handleStatusChange = (event: SelectChangeEvent) => {
    const selectedStatus = event.target.value as OrderStatusType

    if (currentStatus !== 'refunded' && selectedStatus === 'refunded') {
      setPendingStatus(selectedStatus)
      setModalOpen(true)
    } else {
      changeStatus(selectedStatus)
    }
  }

  const handleConfirmRefund = (reason: string) => {
    setModalOpen(false)
    if (pendingStatus) {
      changeStatus(pendingStatus, reason)
      setPendingStatus(null)
    }
  }

  if (isFetching || isLoadingStatus) {
    return (
      <Skeleton
        width="100%"
        height={52}
        variant="rounded"
        sx={{
          borderRadius: '44px',
          maxWidth: 384,
        }}
      />
    )
  }

  return (
    <>
      <FormControl
        fullWidth
        sx={{ maxWidth: 384 }}
      >
        <InputLabel id="change-status-label">Статус</InputLabel>
        <Select
          label="Статус"
          labelId="change-status-label"
          value={currentStatus || ''}
          onChange={handleStatusChange}
          size="medium"
        >
          {(Object.keys(OrderStatus) as OrderStatusType[]).map((item) => (
            <MenuItem key={item} value={item}>
              {orderStatusLabels[item].label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <RefundReasonModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmRefund}
      />
    </>
  )
}
