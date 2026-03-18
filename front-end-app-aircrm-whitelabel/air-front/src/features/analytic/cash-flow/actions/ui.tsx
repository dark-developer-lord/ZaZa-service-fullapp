import { Stack } from '@mui/material'
import { EditButton } from '@shared/ui'

import { useStore } from '../create-update/model/store'
import { TransactionTypeItem } from '@widgets/finance/ui/cash-flow-table/columns'

interface Props {
  row: TransactionTypeItem
}

export const Ui = ({ row }: Props) => {
  const openUpdate = useStore((state) => state.openUpdate)
  // row.id should be the actual API id (not transaction_number)
  // transaction_number is only for display purposes
  return (
    <Stack
      direction="row"
      spacing="16px"
      alignItems="center"
      height="100%"
    >
      <EditButton onClick={() => openUpdate(row.id)} />
    </Stack>
  )
}
