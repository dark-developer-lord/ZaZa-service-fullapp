import { Link } from 'react-router-dom'
import {
  Avatar,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from '@mui/material'

import { formatPhoneNumber, normalizeNumber } from '@shared/lib'

import { LastOrderType } from '../model/last-order-type'

interface Props {
  order: LastOrderType
}

export const LastOrderCard = ({ order }: Props) => {
  const date = new Intl.DateTimeFormat('ru', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: 'numeric',
  }).format(new Date(order.created_at))

  return (
    <ListItemButton
      component={Link}
      to={`/orders/${order.id}`}
    >
      <ListItemAvatar>
        <Avatar
          src={order.customer.avatar || ''}
          alt={order.customer.name}
          sx={{ width: 44, height: 44, mr: '12px' }}
        />
      </ListItemAvatar>
      <ListItemText
        primary={order.customer.name}
        secondary={formatPhoneNumber(order.customer.phone)}
      />
      <ListItemText
        primary={`${normalizeNumber(order.order_amount)} с.`}
        secondary={date}
        primaryTypographyProps={{
          variant: 'medium',
          color: 'success.main',
        }}
        sx={{
          textAlign: 'right',
        }}
      />
    </ListItemButton>
  )
}
