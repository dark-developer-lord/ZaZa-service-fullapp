import toast from 'react-hot-toast'
import { useMutation } from 'react-query'
import { Stack } from '@mui/material'
import { AxiosError } from 'axios'

import { WarehouseItem } from '@entities/warehouses'
import { Api, ApiKeys, deleteQuery, getApiPaths, queryClient } from '@shared/api'
import { DeleteButtonConfirmation, EditButton } from '@shared/ui'

import { useStore } from '../create-update/model/store'

interface Props {
  row: WarehouseItem
}

export const Ui = ({ row }: Props) => {
  const openUpdate = useStore((state) => state.openUpdate)
  const { mutateAsync } = useMutation({
    mutationKey: [ApiKeys.Warehouses.getWarehouse],
    mutationFn: deleteQuery(getApiPaths().deleteWarehouse_ + row.id),
    onSuccess: () => {
      queryClient.refetchQueries(ApiKeys.Warehouses.getWarehousesList)
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
        dialogContent='Нажимая кнопку "Удалить" помните, что все данные будут потеряны и это повлияет на все отчеты в системе. Возможности вернуть как было - увы уже и не будет!'
        onDelete={() => {
          toast.promise(mutateAsync(), {
            success: 'Склад успешно удален',
            loading: 'Удаление склада...',
            error: (error) => {
              if (error instanceof AxiosError) {
                return (
                  error.response?.data.message || 'Ошибка удаления склада'
                )
              }
              return 'Ошибка удаления склада'
            },
          })
        }}
      />
    </Stack>
  )
}
