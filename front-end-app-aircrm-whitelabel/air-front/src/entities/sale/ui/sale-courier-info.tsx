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

import { useGetSale } from '../api/get-sale'


export const SaleCourierInfo = () => {
  const { data, isFetching, isFetched } = useGetSale()
  const courier = data?.data.delivery_man

  const isCourierExist = isFetched && Boolean(courier)

  return (
    <Board sx={{ height: "100%" }}>
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
    </Board>
  )
}
