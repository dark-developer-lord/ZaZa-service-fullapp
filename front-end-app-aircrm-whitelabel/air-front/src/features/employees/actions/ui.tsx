import toast from 'react-hot-toast'
import { useMutation } from 'react-query'
import { Stack } from '@mui/material'
import { AxiosError } from 'axios'

import { Employee } from '@entities/employee'
import { ApiKeys, deleteQuery, queryClient, VendorApi } from '@shared/api'
import { DeleteButtonConfirmation, EditButton } from '@shared/ui'

import { useStore } from '../create-update/model/store'

interface Props {
  row: Employee
}

export const Ui = ({ row }: Props) => {
  const open = useStore((state) => state.openUpdate)
  const { mutateAsync } = useMutation({
    mutationKey: [ApiKeys.Employees.deleteEmployee_ + row.id],
    mutationFn: deleteQuery(VendorApi.deleteEmployee_ + row.id),
    onSuccess: () => {
      queryClient.refetchQueries(ApiKeys.Employees.getEmployees)
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
            success: 'Сотрудник успешно удалён',
            loading: 'Удаление сотрудника',
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
