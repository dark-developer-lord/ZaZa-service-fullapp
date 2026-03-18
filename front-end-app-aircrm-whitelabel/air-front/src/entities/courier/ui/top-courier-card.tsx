import {
  Avatar,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from '@mui/material'

import { formatPhoneNumber } from '@shared/lib'

import { TopCourier } from '../model/top-courier'

interface Props {
  courier: TopCourier
}

export const TopCourierCard = ({ courier }: Props) => {
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
          src={courier.image || ''}
          alt={courier.name}
          sx={{ width: 44, height: 44, mr: '12px' }}
        />
      </ListItemAvatar>
      <ListItemText
        primary={courier.name}
        secondary={formatPhoneNumber(courier.phone)}
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
        primary={courier.order_count}
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
