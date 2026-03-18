import toast from 'react-hot-toast'
import { useMutation } from 'react-query'
import { Stack } from '@mui/material'
import { AxiosError } from 'axios'

import { Attribute } from '@entities/attribute'
import { Api, ApiKeys, deleteQuery, queryClient, VendorApi } from '@shared/api'
import { DeleteButtonConfirmation, EditButton } from '@shared/ui'

import { useStore } from '../create-update/model/store'
import { useGetLoginSource } from '@shared/auth'
interface Props {
  row: Attribute
}

export const Ui = ({ row }: Props) => {
  const openUpdate = useStore((state) => state.openUpdate)
  const loginSource = useGetLoginSource()
  const { mutateAsync } = useMutation({
    mutationKey: [ApiKeys.Attributes.deleteAttribute],
    mutationFn: deleteQuery(VendorApi.deleteAttribute_ + row.id),
    onSuccess: () => {
      queryClient.refetchQueries(ApiKeys.Attributes.getAttributes)
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
        { loginSource === "vendor" && (
          <DeleteButtonConfirmation
            onDelete={() => {
              toast.promise(mutateAsync(), {
                success: 'Атрибут успешно удален',
                loading: 'Удаление атрибута',
                error: (error) => {
                  if (error instanceof AxiosError) {
                    return (
                      error.response?.data.message || 'Ошибка при удалении атрибута'
                    )
                  }
                  return 'Ошибка удалении атрибута'
                },
              })
            }}
          />
        )}
    </Stack>
  )
}
