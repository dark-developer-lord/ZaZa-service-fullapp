import toast from 'react-hot-toast'
import { useMutation } from 'react-query'
import { Stack } from '@mui/material'
import { AxiosError } from 'axios'

import { Admin } from '@entities/admin'
import { Api, ApiKeys, deleteQuery, queryClient } from '@shared/api'
import { DeleteButtonConfirmation, EditButton } from '@shared/ui'

import { useStore } from '../create-update/model/store'

interface Props {
  row: Admin
}

export const Ui = ({ row }: Props) => {
  const open = useStore((state) => state.openUpdate)
  const { mutateAsync } = useMutation({
    mutationKey: [ApiKeys.Admins.deleteAdmin_ + row.id],
    mutationFn: deleteQuery(Api.deleteAdmin_ + row.id),
    onSuccess: () => {
      queryClient.refetchQueries(ApiKeys.Admins.getAdmins)
    },
  })
  return (
    <Stack
      direction="row"
      spacing="16px"
      alignItems="center"
      height="100%"
    >
      <EditButton onClick={() => open(row)} />
      <DeleteButtonConfirmation
        onDelete={() => {
          toast.promise(mutateAsync(), {
            success: 'Админ успешно удалён',
            loading: 'Удаление админа',
            error: (error) => {
              if (error instanceof AxiosError) {
                return error.response?.data.message || 'Ошибка при удалении'
              }
              return 'Ошибка при удалении'
            },
          })
        }}
      />
    </Stack>
  )
}
