import toast from 'react-hot-toast'
import { useMutation } from 'react-query'
import { useParams } from 'react-router-dom'
import { AxiosError } from 'axios'

import { ApiKeys, getApiPaths, postQuery, queryClient } from '@shared/api'

export const useChangeOrderStatus = () => {
  const { id: orderId } = useParams()
  const { mutate, ...query } = useMutation({
    mutationKey: [ApiKeys.Orders.changeStatus],
    mutationFn: postQuery(getApiPaths().changeOrderStatus),
    onSuccess: () => {
      toast.success('Статус заказа успешно изменен')
      queryClient.refetchQueries({
        queryKey: [ApiKeys.Orders.getOrder_ + Number(orderId)],
      })
      queryClient.refetchQueries({
        queryKey: [ApiKeys.Orders.getAccepted_ + Number(orderId)],
      })
      queryClient.refetchQueries({
        queryKey: [ApiKeys.Common.navOrdersCount],
      })
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data.message || 'Ошибка при изменении статуса заказа',
        )
      }
    },
  })

  const changeStatus = (status: string, refund_reason = '') => {
    mutate({
      id: Number(orderId),
      order_status: status,
      refund_reason
    })
  }

  return { changeStatus, ...query }
}
