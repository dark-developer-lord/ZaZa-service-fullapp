import toast from 'react-hot-toast'
import { useMutation } from 'react-query'
import { Stack } from '@mui/material'
import { AxiosError } from 'axios'

import { CategoryItem } from '@entities/category'
import { getApiPaths, Api, VendorApi, ApiKeys, deleteQuery, queryClient } from '@shared/api'
import { DeleteButtonConfirmation, EditButton } from '@shared/ui'

import { useStore } from '../create-update/model/store'
import { useGetLoginSource } from '@shared/auth'

interface Props {
  row: CategoryItem
}

export const Ui = ({ row }: Props) => {
  const openUpdate = useStore((state) => state.openUpdate)
  const loginSource = useGetLoginSource()
  const { mutateAsync } = useMutation({
    mutationKey: [ApiKeys.Categories.deleteCategory],
    mutationFn: deleteQuery(Api.deleteCategory_ + row.id),
    onSuccess: () => {
      queryClient.refetchQueries(ApiKeys.Categories.getCategories)
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
      { loginSource === 'admin' && (
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
      )
      }
    </Stack>
  )
}
