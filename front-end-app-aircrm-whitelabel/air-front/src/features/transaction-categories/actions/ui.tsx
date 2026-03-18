import toast from 'react-hot-toast'
import { useMutation } from 'react-query'
import { Stack } from '@mui/material'
import { AxiosError } from 'axios'

import { TransactionCategoryItem } from '@entities/transaction-category'
import { getApiPaths, ApiKeys, deleteQuery, queryClient } from '@shared/api'
import { DeleteButtonConfirmation, EditButton } from '@shared/ui'

import { useStore } from '../create-update/model/store'

interface Props {
  row: TransactionCategoryItem
}

export const Ui = ({ row }: Props) => {
  const openUpdate = useStore((state) => state.openUpdate)
  const { mutateAsync } = useMutation({
    mutationKey: [ApiKeys.CashFlow.deleteTransactionCategory_],
    mutationFn: deleteQuery(getApiPaths().deleteTransactionCategory_ + row.id),
    onSuccess: () => {
      queryClient.refetchQueries(ApiKeys.CashFlow.getTransactionCategories)
    },
  })
  
  return (
    <Stack
      direction="row"
      spacing="16px"
      alignItems="center"
      height="100%"
    >
      <EditButton onClick={() => openUpdate(row)} />
      <DeleteButtonConfirmation
        onDelete={() => {
          toast.promise(mutateAsync(), {
            success: 'Категория успешно удалена',
            loading: 'Удаление категории...',
            error: (error) => {
              if (error instanceof AxiosError) {
                return (
                  error.response?.data.message || 'Ошибка удаления категории'
                )
              }
              return 'Ошибка удаления категории'
            },
          })
        }}
      />
    </Stack>
  )
}
