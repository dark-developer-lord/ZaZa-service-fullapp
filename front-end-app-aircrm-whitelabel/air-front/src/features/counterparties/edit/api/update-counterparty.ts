import { useMutation } from 'react-query'
import toast from 'react-hot-toast'

import { ApiKeys, putQuery, queryClient, VendorApi } from '@shared/api'
import { CounterpartyDto } from '@features/counterparties/create/model/dto'

export const useUpdateCounterparty = (id: number | null) => {
  const url = `${VendorApi.updateCounterparty_}${id}`

  return useMutation({
    mutationFn: putQuery<CounterpartyDto, unknown>(url),
    mutationKey: [ApiKeys.Counterparties.updateCounterparty, id],
    onSuccess: () => {
      toast.success('Контрагент успешно обновлен')
      queryClient.refetchQueries(ApiKeys.Counterparties.getCounterparties)
    },
    onError: () => {
      toast.error('Ошибка при обновлении контрагента')
    },
  })
}

