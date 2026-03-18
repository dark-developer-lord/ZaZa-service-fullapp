import { useState, useEffect } from 'react'
import { FormControl, Select, MenuItem, SelectChangeEvent, useTheme } from '@mui/material'
import { TransferItem } from '@entities/warehouse/model/warehouse'
import { useGetTransferStatuses } from '@widgets/warehouse/api/get-transfer-statuses'
import { useUpdateTransferStatus } from '@widgets/warehouse/api/update-transfer-status'

interface Props {
  row: TransferItem
  role?: 'sender' | 'receiver'
}

export const TransferStatusDropdown = ({ row, role = 'sender' }: Props) => {
  const theme = useTheme()
  const [localStatus, setLocalStatus] = useState(row.status)
  const { data: statusesData } = useGetTransferStatuses(row.transfer_type, role)
  const { mutate: updateStatus, isLoading } = useUpdateTransferStatus(row.id)

  const statuses = statusesData?.data || []

  // Disable status change for external transfers that have been received
  const isDisabled = 
    isLoading || 
    (role === 'sender' && row.transfer_type === 'external' && row.received_at !== null)

  // Sync local status with row status when it changes (e.g., after refetch)
  useEffect(() => {
    setLocalStatus(row.status)
  }, [row.status])

  const handleChange = (event: SelectChangeEvent) => {
    const newStatus = event.target.value
    const previousStatus = localStatus

    // Optimistically update UI
    setLocalStatus(newStatus)

    // Send API request
    updateStatus(
      { status: newStatus },
      {
        onError: () => {
          // Revert to previous status on error
          setLocalStatus(previousStatus)
        }
      }
    )
  }

  // Check if status label is "Доставлено" (to be shown as "Получено")
  const isReceivedStatus = (statusValue: string) => {
    const statusObj = statuses.find(s => s.value === statusValue)
    return statusObj?.label === 'Доставлено' || statusValue === 'delivered' || statusValue === 'received'
  }

  // Check if status label is "Отправлено"
  const isSentStatus = (statusValue: string) => {
    const statusObj = statuses.find(s => s.value === statusValue)
    return statusObj?.label === 'Отправлено' || statusValue === 'sent' || statusValue === 'transferred'
  }

  // Get color based on status - use success color for received/delivered status, info for sent
  const getStatusColor = (status: string) => {
    // Use success color for received/delivered status
    if (isReceivedStatus(status)) {
      return theme.palette.success.main
    }
    
    // Use info color for sent status
    if (isSentStatus(status)) {
      return theme.palette.info.main
    }
    
    switch (status) {
      case 'pending':
        return '#9A9DA3'
      case 'cancelled':
        return '#F05252'
      case 'completed':
        return '#0E9F6E'
      default:
        return '#9A9DA3'
    }
  }

  // Get label from statuses data or fallback, transforming "Доставлено" to "Получено"
  const getStatusLabel = (status: string) => {
    const statusObj = statuses.find(s => s.value === status)
    let label = statusObj ? statusObj.label : status
    
    // Transform "Доставлено" to "Получено"
    if (label === 'Доставлено') {
      label = 'Получено'
    }
    
    if (!statusObj) {
      // Fallback labels
      switch (status) {
        case 'pending':
          return 'Ожидает'
        case 'completed':
          return 'Завершено'
        case 'cancelled':
          return 'Отменено'
        default:
          return label
      }
    }
    
    return label
  }

  const displayLabel = getStatusLabel(localStatus)
  const statusColor = getStatusColor(localStatus)
  // Ensure "Получено" always uses success color and "Отправлено" uses info color
  const finalColor = displayLabel === 'Получено' 
    ? theme.palette.success.main 
    : displayLabel === 'Отправлено'
    ? theme.palette.info.main
    : statusColor

  return (
    <FormControl size="small" sx={{ minWidth: 150, width: '100%' }}>
      <Select
        value={localStatus}
        onChange={handleChange}
        disabled={isDisabled}
        renderValue={() => (
          <span style={{ 
            color: finalColor, 
            whiteSpace: 'nowrap',
            opacity: isDisabled ? 1 : 1
          }}>
            {displayLabel}
          </span>
        )}
        sx={{
          fontSize: 14,
          fontWeight: 600,
          color: finalColor,
          minWidth: 140,
          '& .MuiSelect-select': {
            overflow: 'visible',
            textOverflow: 'unset',
            color: finalColor + ' !important',
          },
          '&.Mui-disabled': {
            color: finalColor + ' !important',
            '& .MuiSelect-select': {
              color: finalColor + ' !important',
              WebkitTextFillColor: finalColor + ' !important',
            },
          },
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            border: 'none',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            border: 'none',
          },
        }}
      >
        {statuses
          .filter((status) => {
            // For senders, filter out only "Получено" (Доставлено) status from dropdown
            // This status can still be displayed when it is the current status, but can't be selected
            // "Отменено" should remain available for senders to cancel transfers
            if (role === 'sender') {
              const isReceived = status.label === 'Доставлено' || status.value === 'delivered' || status.value === 'received'
              return !isReceived
            }
            return true
          })
          .map((status) => {
            const displayLabel = status.label === 'Доставлено' ? 'Получено' : status.label
            const statusColor = isReceivedStatus(status.value) 
              ? theme.palette.success.main 
              : isSentStatus(status.value)
              ? theme.palette.info.main
              : getStatusColor(status.value)
            
            return (
              <MenuItem 
                key={status.value} 
                value={status.value}
                sx={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: statusColor,
                }}
              >
                {displayLabel}
              </MenuItem>
            )
          })}
      </Select>
    </FormControl>
  )
}

