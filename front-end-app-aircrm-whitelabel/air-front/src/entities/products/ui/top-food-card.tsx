import {
  Avatar,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from '@mui/material'

import { TopFood } from '../../finance/model/top-food'

interface Props {
  food: TopFood
}

export const TopFoodCard = ({ food }: Props) => {
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
          src={food.image || ''}
          alt={food.name}
          sx={{ width: 44, height: 44, mr: '12px' }}
        />
      </ListItemAvatar>
      <ListItemText
        primary={food.name}
        secondary={food.restaurant}
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
        primary={food.order_count}
        secondary={food.order_count === 1 ? 'заказ' : 'заказов'}
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
