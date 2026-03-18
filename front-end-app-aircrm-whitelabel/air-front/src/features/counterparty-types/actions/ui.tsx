import { IconButton, Menu, MenuItem } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { useState, MouseEvent } from 'react'
import { useMutation } from 'react-query'
import toast from 'react-hot-toast'
import { AxiosError } from 'axios'

import { CounterpartyTypeItem } from '@entities/counterparty-type'
import { useStore } from '../create-update/model/store'
import { ApiKeys, deleteQuery, getApiPaths, queryClient } from '@shared/api'

interface Props {
  row: CounterpartyTypeItem
}

export const Actions = ({ row }: Props) => {
  // Don't show actions for system default types
  if (!row.is_custom) {
    return null
  }

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const open = Boolean(anchorEl)
  const openUpdate = useStore((state) => state.openUpdate)

  const { mutate: deleteType, isLoading: isDeleting } = useMutation({
    mutationKey: [ApiKeys.Counterparties.deleteCounterpartyType, row.id!],
    mutationFn: deleteQuery(getApiPaths().deleteCounterpartyType_ + row.id!),
    onSuccess() {
      toast.success('Тип контрагента успешно удален')
      queryClient.refetchQueries(ApiKeys.Counterparties.getCounterpartyTypes)
      handleClose()
    },
    onError(error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message || 'Произошла ошибка при удалении типа контрагента')
      }
    },
  })

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleEdit = () => {
    openUpdate(row)
    handleClose()
  }

  const handleDelete = () => {
    if (window.confirm('Вы уверены, что хотите удалить этот тип контрагента?')) {
      deleteType()
    }
  }

  return (
    <>
      <IconButton
        onClick={handleClick}
        size="small"
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleEdit}>
          Редактировать
        </MenuItem>
        <MenuItem onClick={handleDelete} disabled={isDeleting}>
          Удалить
        </MenuItem>
      </Menu>
    </>
  )
}

