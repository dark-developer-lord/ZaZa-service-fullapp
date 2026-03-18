import { useNavigate } from 'react-router-dom'

import EditIcon from '@icons/edit.svg?react'

import { Installment } from './columns'

interface Props {
  row: Installment
}

export const Actions = ({ row }: Props) => {
  const navigate = useNavigate()

  return (
    <EditIcon
      onClick={() => navigate(`/installment/edit/${row.id}`)}
      style={{ cursor: 'pointer' }}
    />
  )
}
