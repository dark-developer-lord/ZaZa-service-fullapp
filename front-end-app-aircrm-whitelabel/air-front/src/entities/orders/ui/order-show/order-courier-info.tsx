import { FC } from 'react'
import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Skeleton,
  Typography,
} from '@mui/material'

import { formatPhoneNumber } from '@shared/lib'
import { Board } from '@shared/ui'

import { useGetOrder } from '../../api/get-order'
import { OrderDeliveryMan } from '../../model/order-show-types'

interface Props {
  ButtonSlot: FC<{
    courier?: OrderDeliveryMan | null
    isCourierExist: boolean
    isFetching: boolean
  }>,
}

export const OrderCourierInfo = ({ ButtonSlot }: Props) => {
  const { data, isFetching, isFetched } = useGetOrder()
  const courier = data?.data.delivery_man

  const isCourierExist = isFetched && Boolean(courier)

  const canAssigningCourier =
    data &&
    data.data.order_status !== 'delivered' &&
    data.data.order_status !== 'canceled'

  return (
    <Board>
      <Typography
        variant="h6"
        sx={{ mb: '12px' }}
      >
        Курьер
      </Typography>
      {!isCourierExist && !isFetching && (
        <Typography
          variant="large"
          component="p"
          sx={{ py: '24px', textAlign: 'center' }}
        >
          Курьер не назначен
        </Typography>
      )}
      {(isCourierExist || isFetching) && (
        <ListItem component="div">
          <ListItemAvatar>
            {isFetching ? (
              <Skeleton
                variant="circular"
                width={44}
                height={44}
              />
            ) : (
              <Avatar
                src={courier?.avatar || ''}
                alt={courier?.f_name || ''}
                sx={{ width: 44, height: 44 }}
              />
            )}
          </ListItemAvatar>
          <ListItemText
            primary={
              isFetching ? (
                <Skeleton
                  width="80%"
                  variant="text"
                />
              ) : (
                `${courier?.f_name || ''} ${courier?.l_name || ''}`
              )
            }
            secondary={
              isFetching ? (
                <Skeleton
                  width="80%"
                  variant="text"
                />
              ) : (
                formatPhoneNumber(courier?.phone || '')
              )
            }
          />
        </ListItem>
      )}
      {canAssigningCourier && (
        <ButtonSlot
          courier={courier}
          isCourierExist={isCourierExist}
          isFetching={isFetching}
        />
      )}
    </Board>
  )
}
