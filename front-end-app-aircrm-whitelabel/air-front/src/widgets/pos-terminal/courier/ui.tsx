import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  Box,
} from '@mui/material'

import { useCartStore } from '@features/pos-terminal'
// import { useProfile } from '@shared/auth'
import { formatPhoneNumber } from '@shared/lib'
import { CollapsibleCard } from '@shared/ui'

// import { Courier } from '@entities/courier'

// import { useGetOrder } from '../../api/get-order'
// import { OrderDeliveryMan } from '../../model/order-show-types'

import { Button } from './button'

export const UI = () => {
  // const loginSource = useProfile((profile) => profile.source)
  const deliveryMan = useCartStore((state) => state.deliveryMan)
  // const { data, isFetching, isFetched } = useGetOrder()
  // const courier = data?.data.delivery_man

  // const isCourierExist = isFetched && Boolean(courier)

  // const canAssigningCourier =
  //   data &&
  //   data.data.order_status !== 'delivered' &&
  //   data.data.order_status !== 'canceled'

  return (
    <CollapsibleCard
      title="Курьер"
      defaultExpanded={false}
      sx={{ mb: 2, bgcolor: 'white' }}
    >
      <Box>
        {deliveryMan === null && (
          <Typography
            variant="large"
            component="p"
            sx={{ py: '24px', textAlign: 'center' }}
          >
            Курьер не назначен
          </Typography>
        )}
        {deliveryMan && (
          <ListItem component="div" sx={{ px: 0 }}>
            <ListItemAvatar>
                <Avatar
                  src={deliveryMan?.avatar || ''}
                  alt={deliveryMan?.f_name || ''}
                  sx={{ width: 44, height: 44 }}
                />
            </ListItemAvatar>
            <ListItemText
              primary={
                `${deliveryMan?.f_name || ''} ${deliveryMan?.l_name || ''}`
              }
              secondary={
                formatPhoneNumber(deliveryMan?.phone || '')
              }
            />
          </ListItem>
        )}
          <Button
            // courier={courier}
            isCourierExist={ deliveryMan === null ? false : true}
            isFetching={false}
          />
      </Box>
    </CollapsibleCard>
  )
}
