import toast from 'react-hot-toast'
import { useMutation } from 'react-query'
import { Stack } from '@mui/material'
import { AxiosError } from 'axios'

import { Banner } from '@entities/banner'
import { Api, ApiKeys, deleteQuery, queryClient } from '@shared/api'
import { DeleteButtonConfirmation, EditButton } from '@shared/ui'

import { useStore } from '../create-update/model/store'

interface Props {
  row: Banner
}

export const Ui = ({ row }: Props) => {
  const openUpdate = useStore((state) => state.openUpdate)
  const { mutateAsync } = useMutation({
    mutationKey: [ApiKeys.Banners.deleteBanner_ + row.id],
    mutationFn: deleteQuery(Api.deleteBanner_ + row.id),
    onSuccess: () => {
      queryClient.refetchQueries(ApiKeys.Banners.getBanners)
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
            success: 'Баннер успешно удален',
            loading: 'Удаление Баннера',
            error: (error) => {
              if (error instanceof AxiosError) {
                return (
                  error.response?.data.message || 'Ошибка при удалении баннера'
                )
              }
              return 'Ошибка удалении баннера'
            },
          })
        }}
      />
    </Stack>
  )
}
