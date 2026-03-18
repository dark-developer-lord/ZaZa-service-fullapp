import toast from 'react-hot-toast'
import { useMutation } from 'react-query'
import { Link } from 'react-router-dom'
import { Stack } from '@mui/material'
import { AxiosError } from 'axios'

import { ProductItem } from '@entities/warehouse'
import { FoodItem } from '@entities/products'

import { getApiPaths , ApiKeys, deleteQuery, queryClient } from '@shared/api'
import { RouterPaths } from '@shared/lib'
import { DeleteButtonConfirmation, EditButton } from '@shared/ui'

interface Props {
  row: FoodItem
}

export const Ui = ({ row }: Props) => {
  const { mutateAsync } = useMutation({
    mutationKey: [ApiKeys.Products.deleteProduct_ + row.id],
    mutationFn: deleteQuery(getApiPaths().deleteProduct_ + row.id),
    onSuccess: () => {
      queryClient.refetchQueries(ApiKeys.Products.getProducts)
    },
  })
  return (
    <Stack
      direction="row"
      spacing="16px"
      alignItems="center"
      height="100%"
    >
      <EditButton
        component={Link}
        to={RouterPaths.editProduct_ + row.id}
      />
      <DeleteButtonConfirmation
        dialogContent='Нажимая кнопку "Удалить" помните, что все данные будут потеряны и это повлияет на все отчеты в системе. Возможности вернуть как было - увы уже и не будет!'
        onDelete={() => {
          toast.promise(mutateAsync(), {
            success: 'Продукт успешно удалён',
            loading: 'Удаление продукта',
            error: (error) => {
              if (error instanceof AxiosError) {
                return (
                  error.response?.data.message || 'Ошибка удаления продукта'
                )
              }
              return 'Ошибка удаления продукта'
            },
          })
        }}
      />
    </Stack>
  )
}
