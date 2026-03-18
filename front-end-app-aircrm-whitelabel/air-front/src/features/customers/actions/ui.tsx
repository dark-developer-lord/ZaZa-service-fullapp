import { IconButton } from '@mui/material'
import { Link } from 'react-router-dom'

import { CustomerItem } from '@entities/customer'
import BaseIcon from '@icons/base.svg?react'

interface Props {
  row: CustomerItem
}

export const Ui = ({ row }: Props) => {
  return (
    <IconButton
      component={Link}
      to={`/customers/${row.id}`}
      size="small"
      sx={{
        '&:hover': {
          backgroundColor: 'rgba(0, 84, 86, 0.1)',
        },
      }}
    >
      <BaseIcon
        width={20}
        height={20}
        fill="currentColor"
      />
    </IconButton>
  )
}
