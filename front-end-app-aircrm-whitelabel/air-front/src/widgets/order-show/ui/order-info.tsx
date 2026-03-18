import { Link, useParams } from 'react-router-dom'
import { Box, Button, Skeleton, Stack, Typography } from '@mui/material'

import { ChangeOrderStatus } from '@features/orders'
import { useGetOrder } from '@entities/orders'
import { RouterPaths } from '@shared/lib'
import { Board } from '@shared/ui'

export const OrderInfo = () => {
  const { id } = useParams()
  const { data, isFetching } = useGetOrder()
  return (
    <Board>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h6">
          {isFetching ? (
            <Skeleton
              height={24}
              variant="rounded"
              width={200}
            />
          ) : (
            'Заказ №' + (data?.data.order_number || data?.data.id)
          )}
        </Typography>
        <Stack
          sx={{ ml: 'auto' }}
          spacing="12px"
          direction="row"
        >
          <Button
            size="small"
            color="secondary"
            component={Link}
            to={RouterPaths.editOrder_ + id}
          >
            Изменить заказ
          </Button>
        </Stack>
      </Box>
      <Stack
        direction="row"
        spacing="24px"
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
          mt: '24px',
        }}
      >
        <ChangeOrderStatus />
        {isFetching || !data ? (
          <Skeleton
            height={20}
            variant="rounded"
            width={80}
          />
        ) : (
          <Typography
            variant="small"
            color="text.secondary"
          >
            {new Date(data.data.created_at).toLocaleString('ru')}
          </Typography>
        )}
      </Stack>
    </Board>
  )
}
