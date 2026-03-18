import toast from 'react-hot-toast'
import { useMutation } from 'react-query'
import { Stack } from '@mui/material'
import { AxiosError } from 'axios'

import { StoreItem } from '@entities/stores'
import { Api, ApiKeys, deleteQuery, queryClient } from '@shared/api'
import { DeleteButtonConfirmation, EditButton } from '@shared/ui'

import { useStore } from '../create-update/model/store'

interface Props {
  row: StoreItem
}

export const Ui = ({ row }: Props) => {
  const openUpdate = useStore((state) => state.openUpdate)
  const { mutateAsync } = useMutation({
    mutationKey: [ApiKeys.Stores.getStore_],
    mutationFn: deleteQuery(Api.deleteStore_ + 'delete/' + row.id),
    onSuccess: () => {
      queryClient.refetchQueries(ApiKeys.Stores.getStores)
    },
  })
  return (
    <Stack
      direction="row"
      spacing="16px"
      alignItems="center"
      height="100%"
    >
      <EditButton onClick={() => openUpdate(row) } />
      <DeleteButtonConfirmation
        onDelete={() => {
          toast.promise(mutateAsync(), {
            success: 'Магазин успешно удален',
            loading: 'Удаление магазин...',
            error: (error) => {
              if (error instanceof AxiosError) {
                return (
                  error.response?.data.message || 'Ошибка удаления магазина'
                )
              }
              return 'Ошибка удаления магазина'
            },
          })
        }}
      />
    </Stack>
  )
}
