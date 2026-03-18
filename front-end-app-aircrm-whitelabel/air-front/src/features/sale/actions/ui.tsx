import { useNavigate } from 'react-router-dom'
import { Stack } from '@mui/material'

import { SaleItem } from '@entities/warehouse'
import { EditButton } from '@shared/ui'

import { RouterPaths } from '@shared/lib'

interface Props {
  row: SaleItem
}

export const Ui = ({ row }: Props) => {
  const navigate = useNavigate()
  return (
    <Stack
      direction="row"
      spacing="16px"
      alignItems="center"
      height="100%"
    >
        <EditButton onClick={() => navigate(RouterPaths.showSale_ + row.id)}/>
    </Stack>
  )
}
