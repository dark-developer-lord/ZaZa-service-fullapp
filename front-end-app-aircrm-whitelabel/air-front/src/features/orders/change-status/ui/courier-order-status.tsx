import { useState, useEffect } from 'react'
import {
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material'
import { useMutation } from 'react-query'
import toast from 'react-hot-toast'

import { Order } from '@entities/orders'
import { OrderStatus, orderStatusLabels } from '@shared/lib'
import { postQuery, DeliveryManApi, queryClient, ApiKeys } from '@shared/api'

interface Props {
  row: Order
}

export const CourierOrderStatusSelect = ({ row }: Props) => {
  const [status, setStatus] = useState(row.status)

  const { mutateAsync, isLoading } = useMutation({
    mutationFn: postQuery(
      import.meta.env.VITE_APP_API_URL + '/v1' + DeliveryManApi.changeCourierOrderStatus
    ),
  })

  useEffect(() => {
    setStatus(row.status)
  }, [row.status])

  const handleChange = async (event: SelectChangeEvent) => {
    const newStatus = event.target.value
    setStatus(newStatus as typeof row.status)

    toast.promise(
      mutateAsync(
        {
          id: row.id,
          order_status: newStatus,
        },
        {
          onSuccess: () => {
            queryClient.refetchQueries({
              queryKey: [ApiKeys.Orders.getOrder_ + row.id],
            })
            queryClient.refetchQueries({
              queryKey: [ApiKeys.Common.navOrdersCount],
            })
          },
        }
      ),
      {
        loading: 'Изменение статуса...',
        success: 'Статус обновлён',
        error: 'Ошибка при изменении статуса',
      }
    )
  }

  return (
    <Select
      value={status}
      onChange={handleChange}
      disabled={isLoading}
      size="small"
      sx={{
        borderRadius: '12px',
        backgroundColor: orderStatusLabels[status].color + '.main',
        color: orderStatusLabels[status].color ? 'white' : 'black',
        fontSize: { xs: '9px', mobile: '13px' },
      }}
    >
      <MenuItem value={OrderStatus.picked_up}>
        {orderStatusLabels[OrderStatus.picked_up].label}
      </MenuItem>
      <MenuItem value={OrderStatus.delivered}>
        {orderStatusLabels[OrderStatus.delivered].label}
      </MenuItem>
      <MenuItem value={OrderStatus.postponed}>
        {orderStatusLabels[OrderStatus.postponed].label}
      </MenuItem>
    </Select>
  )
}
