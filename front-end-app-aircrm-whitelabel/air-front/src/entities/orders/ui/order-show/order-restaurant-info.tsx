import { Avatar, Box, Skeleton, Stack, Typography } from '@mui/material'

import { formatPhoneNumber } from '@shared/lib'
import { Board } from '@shared/ui'

import { useGetOrder } from '../../api/get-order'

export const OrderRestaurantInfo = () => {
  const { data } = useGetOrder()
  const store = data?.data.store
  const warehouse = data?.data.warehouse;

  return (
    <Board>
      <Typography
        variant="h6"
        sx={{ mb: '12px' }}
      >
        { store ? 'Магазин' : 'Склад' }
      </Typography>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
        }}
      >
        {store ? (
          <Avatar
            src={store.logo || store.name}
            alt={store.name}
            sx={{ width: 80, height: 80, flexShrink: 0, mr: '24px' }}
          />
        ) : warehouse ? (
          <Avatar
          src={warehouse.name}
          alt={warehouse.name}
          sx={{ width: 80, height: 80, flexShrink: 0, mr: '24px' }}
        />
        ) : (
          <Skeleton
            variant="circular"
            sx={{ width: 80, height: 80, flexShrink: 0, mr: '24px' }}
          />
        )}
        <Stack spacing="8px">
          {store ? (
            <Typography
              variant="medium"
              fontWeight={600}
            >
              {store.name}
            </Typography>
          ) : warehouse ? (
            <Typography
            variant="medium"
            fontWeight={600}
          >
            {warehouse.name}
          </Typography>
          ) : (
            <Skeleton
              width={200}
              height={20}
              variant="rounded"
            />
          )}
          {store?.phone ? (
            <Typography
              variant="small"
              component="p"
            >
              {formatPhoneNumber(store.phone)}
            </Typography>
          ) : warehouse ? null : (
            <Skeleton
              variant="rounded"
              height={20}
              width={150}
            />
          )}
          {store?.address || store?.address === null ? (
            <Typography
              variant="small"
              component="p"
            >
              {store.address === null ? 'Адрес не указан' : store.address}
            </Typography>
          ) : warehouse ? null : (
            <Skeleton
              variant="rounded"
              height={20}
              width={150}
            />
          )}
        </Stack>
      </Box>
    </Board>
  )
}
