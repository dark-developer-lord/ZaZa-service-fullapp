import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useMutation } from 'react-query'
import { MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { AxiosError } from 'axios'

import { CategoryItem } from '@entities/category'
import { VendorApi, ApiKeys, postQuery } from '@shared/api'

import { prioritySelectOptions } from './lib'

interface Props {
  row: CategoryItem
}

export const Ui = ({ row }: Props) => {
  const [priority, setPriority] = useState<number>(row.priority)
  const { isLoading, mutateAsync } = useMutation({
    mutationKey: [ApiKeys.Categories.updatePriorityCategory_ + row.id],
    mutationFn: postQuery(VendorApi.updatePriorityCategory_ + row.id),
  })

  useEffect(() => {
    setPriority(row.priority)
  }, [row])

  const handleChange = (event: SelectChangeEvent<number>) => {
    toast.promise(
      mutateAsync(
        {
          priority: event.target.value,
        },
        {
          onSuccess() {
            setPriority(event.target.value as number)
          },
        },
      ),
      {
        success: 'Приоритет успешно изменен',
        loading: 'Изменение приоритета',
        error: (error) => {
          if (error instanceof AxiosError) {
            return (
              error.response?.data.message || 'Ошибка при изменении приоритета'
            )
          }
          return 'Ошибка при изменении приоритета'
        },
      },
    )
  }

  return (
    <Select
      value={priority}
      size="small"
      variant="outlined"
      onChange={handleChange}
      disabled={isLoading}
      sx={{ width: 150 }}
    >
      {Object.keys(prioritySelectOptions).map((id) => (
        <MenuItem
          key={id}
          value={id}
        >
          {prioritySelectOptions[id]}
        </MenuItem>
      ))}
    </Select>
  )
}
