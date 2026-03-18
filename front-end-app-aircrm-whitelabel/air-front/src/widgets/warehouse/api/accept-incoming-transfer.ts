import { useMutation } from 'react-query'
import toast from 'react-hot-toast'
import { AxiosError } from 'axios'

import { ApiKeys, postQuery, queryClient, getApiPaths } from '@shared/api'

interface AcceptTransferDto {
  to_warehouse_id: number
}

interface AcceptTransferParams {
  transferId: number
  data: AcceptTransferDto
}

export const useAcceptIncomingTransfer = () => {
  return useMutation({
    mutationKey: [ApiKeys.WarehouseReports.acceptIncomingTransfer_],
    mutationFn: ({ transferId, data }: AcceptTransferParams) => {
      return postQuery<AcceptTransferDto, { data: any }>(
        `${getApiPaths().acceptIncomingTransfer_}${transferId}/accept`
      )(data)
    },
    onSuccess() {
      toast.success('Перемещение успешно принято')
      queryClient.refetchQueries(ApiKeys.WarehouseReports.getIncomingTransfers)
      queryClient.refetchQueries(ApiKeys.WarehouseReports.getIncomingTransfersCount)
    },
    onError(error) {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data.message || 'Произошла ошибка при принятии перемещения',
        )
      }
    },
  })
}

