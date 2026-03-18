import toast from 'react-hot-toast'
import { useMutation } from 'react-query'
import { Stack } from '@mui/material'
import { AxiosError } from 'axios'

import { SubCategory } from '@entities/sub-category'
import { Api, ApiKeys, deleteQuery, queryClient, VendorApi } from '@shared/api'
import { DeleteButtonConfirmation, EditButton } from '@shared/ui'

import { useStore } from '../create-update/model/store'
import { useGetLoginSource } from '@shared/auth'

interface Props {
  row: SubCategory
}

export const Ui = ({ row }: Props) => {
  const openUpdate = useStore((state) => state.openUpdate)
  const loginSource = useGetLoginSource()
  const { mutateAsync } = useMutation({
    mutationKey: [ApiKeys.Categories.deleteSubCategory_ + row.id],
    mutationFn: deleteQuery(Api.deleteCategory_ + row.id),
    onSuccess: () => {
      queryClient.refetchQueries(ApiKeys.Categories.getSubCategories)
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
      )}
    </Stack>
  )
}
