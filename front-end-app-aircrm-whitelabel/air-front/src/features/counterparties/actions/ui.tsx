import { Counterparty } from '@entities/counterparty'
import { EditButton } from '@shared/ui'
import { useEditCounterpartyModal } from '../edit'

interface Props {
  row: Counterparty
}

export const Ui = ({ row }: Props) => {
  const { open } = useEditCounterpartyModal()

  const handleClick = () => {
    open(row.id)
  }

  return (
    <EditButton
      onClick={handleClick}
      size="small"
    />
  )
}

