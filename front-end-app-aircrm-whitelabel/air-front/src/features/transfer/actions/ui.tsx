import { Stack } from '@mui/material'
import { useNavigate } from 'react-router-dom'

import { TransferItem } from '@entities/warehouse'
import { EditButton } from '@shared/ui'
import { RouterPaths } from '@shared/lib'

interface Props {
  row: TransferItem
}

export const Ui = ({ row }: Props) => {
  const navigate = useNavigate()

  const handleEdit = () => {
    navigate(RouterPaths.editTransfer_ + row.id)
  }

  return (
    <Stack
      direction="row"
      spacing="16px"
      alignItems="center"
      height="100%"
    >
      <EditButton onClick={handleEdit} />
    </Stack>
  )
}

