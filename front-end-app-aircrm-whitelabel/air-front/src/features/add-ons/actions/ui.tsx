import toast from 'react-hot-toast'
import { useMutation } from 'react-query'
import { Stack } from '@mui/material'
import { AxiosError } from 'axios'

import { AddOn } from '@entities/add-on'
import { ApiKeys, deleteQuery, getApiPaths, queryClient } from '@shared/api'
import { DeleteButtonConfirmation, EditButton } from '@shared/ui'

import { useStore } from '../create-update/model/store'

interface Props {
  row: AddOn
}

export const Ui = ({ row }: Props) => {
  const openUpdate = useStore((state) => state.openUpdate)
  const { mutateAsync } = useMutation({
    mutationKey: [ApiKeys.AddOns.deleteAddOn_ + row.id],
    mutationFn: deleteQuery(getApiPaths().deleteAddOn_ + row.id),
    onSuccess: () => {
      queryClient.refetchQueries(ApiKeys.AddOns.getAddOns)
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
            success: 'Дополнения успешна удалена',
            loading: 'Удаление дополнении...',
            error: (error) => {
              if (error instanceof AxiosError) {
                return (
                  error.response?.data.message || 'Ошибка удаления дополнения'
                )
              }
              return 'Ошибка удаления дополнения'
            },
          })
        }}
      />
    </Stack>
  )
}
