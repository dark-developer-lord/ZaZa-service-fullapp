import { useMutation } from 'react-query'
import toast from 'react-hot-toast'
import { AxiosError } from 'axios'

import { ApiKeys, putQuery, queryClient, getApiPaths } from '@shared/api'

interface UpdateTransferStatusDto {
  status: string
}

export const useUpdateTransferStatus = (transferId: number) => {
  return useMutation({
    mutationKey: [ApiKeys.WarehouseReports.updateTransferStatus_, transferId],
    mutationFn: putQuery<UpdateTransferStatusDto, { data: any }>(
      `${getApiPaths().updateTransferStatus_}${transferId}`
    ),
    onSuccess() {
      toast.success('Статус перемещения успешно обновлен')
      queryClient.refetchQueries(ApiKeys.WarehouseReports.getTransfers)
    },
    onError(error) {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data.message || 'Произошла ошибка при обновлении статуса',
        )
      }
    },
  })
}

