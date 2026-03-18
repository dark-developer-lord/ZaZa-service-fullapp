import {
    MenuItem,
    Select,
    SelectChangeEvent,
} from '@mui/material'

import { useEffect, useState } from 'react';
import { Order } from '@entities/orders'
import { OrderStatus, orderStatusLabels, OrderStatusType } from '@shared/lib'

import { useMutation } from 'react-query';
import { ApiKeys, getApiPaths, postQuery, queryClient } from '@shared/api';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import { RefundReasonModal } from '@shared/ui/refund-reason-modal';
interface Props {
  row: Order
}

export const SelectOrderStatus = ({ row }: Props ) => {

    const [modalOpen, setModalOpen] = useState(false);
    const [pendingStatus, setPendingStatus] = useState<string | null>(null);
    
    const [ orderStatus, setOrderStatus ] = useState(row.status)
    const { isLoading, mutateAsync } = useMutation({
      mutationKey: [ApiKeys.Orders.changeStatus + `/${row.id}`],
      mutationFn: postQuery(getApiPaths().changeOrderStatus),
    })

      useEffect(() => {
        setOrderStatus(row.status)
      }, [row])

    const handleChange = (event: SelectChangeEvent) => {
      const newStatus = event.target.value;
      
      if (newStatus === 'successful' && row.installment > 0) {
        toast.error('Нельзя установить статус "Успешно", пока есть долг.');
        return;
      }

      if (
        row.status === 'successful' &&
        (newStatus === 'canceled' || newStatus === 'postponed')
      ) {
        toast.error('Нельзя изменить статус "Успешно" на "Отменено или Перенесено".');
        return;
      }

      if (row.status !== 'refunded' && newStatus === 'refunded') {
        setPendingStatus(newStatus);
        setModalOpen(true);
      } else{
        toast.promise(
              mutateAsync(
                {
                  id: row.id,
                  order_status: event.target.value as any,
                  refund_reason: null,
                },
                {
                  onSuccess() {
                    setOrderStatus(event.target.value as any),
                    queryClient.refetchQueries({
                      queryKey: [ApiKeys.Common.navOrdersCount],
                    }),
                    queryClient.refetchQueries({
                      queryKey: [ApiKeys.Orders.getOrder_ + Number(row.id)],
                    })
                  },
                },
              ),
              {
              success: 'Статус заказа успешно изменен',
              loading: 'Изменение статуса заказа',
              error: (error) => {
                if (error instanceof AxiosError) {
                  return (
                    error.response?.data.message || 'Ошибка при изменении статуса заказа'
                  )
                }
                return 'Ошибка при изменении статуса заказа'
              },
            },
          )
      }
    }

    const handleConfirmRefund = (reason: string) => {
      setModalOpen(false);
      if (pendingStatus) {
        toast.promise(
          mutateAsync({
            id: row.id,
            order_status: pendingStatus as any,
            refund_reason: reason,
          }, {
            onSuccess() {
              setOrderStatus(pendingStatus as any)
              queryClient.refetchQueries({
                queryKey: [ApiKeys.Orders.getOrder_ + Number(row.id)],
              })
              queryClient.refetchQueries({
                queryKey: [ApiKeys.Common.navOrdersCount],
              })
            }
          }),
          { loading: 'Обновление...', success: 'Успешно', error: 'Ошибка' }
        );
        setPendingStatus(null);
      }
    };



  return (
    <div>
      <Select
          value={orderStatus}
          onChange={handleChange}
          disabled={isLoading}
          size="small"
          sx={{
            borderRadius: '12px',
            backgroundColor: orderStatusLabels[orderStatus].color + ".main",
            color: orderStatusLabels[orderStatus].color ? "white" : "black",
            fontSize: {xs: '9px', mobile: '13px'}
          }}
          >
            {
              (Object.keys(OrderStatus) as OrderStatusType[])
              .map((item) => (
                <MenuItem
                    key={item}
                    value={item}
                    sx={{fontSize: {xs: '11px', mobile: '15px'}}}
                  >
                    {orderStatusLabels[item].label}
                  </MenuItem>
                ))
            }
      </Select>
      <RefundReasonModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmRefund}
      />
    </div>
  )
}

