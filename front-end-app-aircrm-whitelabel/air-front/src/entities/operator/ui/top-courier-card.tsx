import {
  Avatar,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from '@mui/material'

import { formatPhoneNumber } from '@shared/lib'

import { TopOperator } from '../model/top-courier'

interface Props {
  operator: TopOperator
}

export const TopOperatorCard = ({ operator }: Props) => {
  return (
    <ListItemButton
      sx={{
        bgcolor: 'grey.100',
        padding: '16px',
        cursor: 'auto',
      }}
    >
      <ListItemAvatar>
        <Avatar
          src={operator.image || ''}
          alt={operator.f_name}
          sx={{ width: 44, height: 44, mr: '12px' }}
        />
      </ListItemAvatar>
      <ListItemText
        primary={`${operator.f_name} ${operator.l_name || ''}`}
        secondary={formatPhoneNumber(operator.phone)}
        secondaryTypographyProps={{
          sx: {
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            minWidth: 'auto',
          },
        }}
        sx={{
          m: 0,
          mr: 2,
        }}
      />
      <ListItemText
        primary={operator.orders_count}
        secondary="заказов"
        primaryTypographyProps={{
          variant: 'medium',
          color: 'primary.main',
        }}
        secondaryTypographyProps={{
          sx: {
            textOverflow: 'revert !important',
          },
        }}
        sx={{
          textAlign: 'right',
          minWidth: 'auto',
          m: 0,
        }}
      />
    </ListItemButton>
  )
}
