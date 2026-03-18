import { ChangeEvent, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useMutation } from 'react-query'
import { Box } from '@mui/material'
import { AxiosError } from 'axios'

import { StoreItem } from '@entities/stores'
import { Api, ApiKeys, postQuery } from '@shared/api'
import { Toggle } from '@shared/ui'

interface Props {
  row: StoreItem
}

export const Ui = ({ row }: Props) => {
  const [status, setStatus] = useState(row.status)
  const { isLoading, mutateAsync } = useMutation({
    mutationKey: [ApiKeys.Stores.updateStoreStatus_ + row.id],
    mutationFn: postQuery(Api.updateStoreStatus_ + 'status/' + row.id),
  })

  useEffect(() => {
    setStatus(row.status)
  }, [row])

  const handleChange = (_: ChangeEvent, checked: boolean) => {
    setStatus(checked)
    toast.promise(
      mutateAsync(
        {
          status: checked ? 1 : 0,
        },
        {
          onError() {
            setStatus(!checked)
          },
        },
      ),
      {
        success: 'Статус успешно изменен',
        loading: 'Изменение статуса',
        error: (error) => {
          if (error instanceof AxiosError) {
            return (
              error.response?.data.message || 'Ошибка при изменении статуса'
            )
          }
          return 'Ошибка при изменении статуса'
        },
      },
    )
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
      <Toggle
        checked={status}
        disabled={isLoading}
        onChange={handleChange}
      />
    </Box>
  )
}
