import toast from 'react-hot-toast'
import { useMutation } from 'react-query'
import { Stack } from '@mui/material'
import { AxiosError } from 'axios'

import { TransactionSubCategoryItem } from '@entities/transaction-sub-categories'
import { getApiPaths, ApiKeys, deleteQuery, queryClient } from '@shared/api'
import { DeleteButtonConfirmation, EditButton } from '@shared/ui'

import { useStore } from '../create-update/model/store'

interface Props {
  row: TransactionSubCategoryItem
}

export const Ui = ({ row }: Props) => {
  const openUpdate = useStore((state) => state.openUpdate)
  const { mutateAsync } = useMutation({
    mutationKey: [ApiKeys.CashFlow.deleteTransactionCategory_],
    mutationFn: deleteQuery(getApiPaths().deleteTransactionCategory_ + row.id),
    onSuccess: () => {
      queryClient.refetchQueries(ApiKeys.CashFlow.getTransactionSubCategories_)
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
            success: 'Подкатегория успешно удалена',
            loading: 'Удаление подкатегории...',
            error: (error) => {
              if (error instanceof AxiosError) {
                return (
                  error.response?.data.message || 'Ошибка удаления подкатегории'
                )
              }
              return 'Ошибка удаления подкатегории'
            },
          })
        }}
      />
    </Stack>
  )
}
