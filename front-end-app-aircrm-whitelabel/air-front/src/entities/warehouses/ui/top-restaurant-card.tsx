import {
  Avatar,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from '@mui/material'

import { TopRestaurant } from '../model/top-restaurant'

interface Props {
  restaurant: TopRestaurant
}

export const TopRestaurantCard = ({ restaurant }: Props) => {
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
          src={restaurant.logo || ''}
          alt={restaurant.name}
          sx={{ width: 44, height: 44, mr: '12px' }}
        />
      </ListItemAvatar>
      <ListItemText
        primary={restaurant.name}
        secondary={restaurant.address}
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
        primary={restaurant.order_count}
        secondary={restaurant.order_count === 1 ? 'заказ' : 'заказов'}
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
