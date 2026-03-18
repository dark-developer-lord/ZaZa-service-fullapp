import { Avatar, Box, Skeleton, Stack, Typography } from '@mui/material'

import { formatPhoneNumber } from '@shared/lib'
import { Board } from '@shared/ui'

import { useGetOrder } from '../../api/get-order'

export const OrderCustomerInfo = () => {
  const { data, isSuccess } = useGetOrder()
  const customer = data?.data.customer

  if (
    (!isSuccess && data && data.data.customer.f_name === '') ||
    data?.data.customer.phone === ''
  ) {
    return null
  }

  return (
    <Board>
      <Typography
        variant="h6"
        sx={{ mb: '12px' }}
      >
        Клиент
      </Typography>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
        }}
      >
        {customer?.f_name && customer.phone ? (
          <Avatar
            src={customer.avatar || customer.f_name || ''}
            alt={customer.f_name || customer.l_name || ''}
            sx={{ width: 80, height: 80, flexShrink: 0, mr: '24px' }}
          />
        ) : (
          <Skeleton
            variant="circular"
            sx={{ width: 80, height: 80, flexShrink: 0, mr: '24px' }}
          />
        )}
        <Stack spacing="8px">
          <InfoItem
            label="ФИО"
            value={
              customer && `${customer.f_name || ''} ${customer.l_name || ''}`
            }
          />
          <InfoItem
            label="Телефон"
            value={customer && formatPhoneNumber(customer.phone)}
          />
          {data?.data.delivery_address && (
            <InfoItem
              label="Адрес"
              value={data.data.delivery_address}
            />
          )}
          {data?.data.comment && (
            <InfoItem
                label="Комментарий"
                value={data.data.comment}
              />
          )
          }
        </Stack>
      </Box>
    </Board>
  )
}

interface InfoItemProps {
  label: string
  value?: string | object
}

const InfoItem = ({ label, value }: InfoItemProps) => {
  
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Typography
        variant="small"
        sx={{ color: 'text.secondary', minWidth: 100 }}
      >
        {label}:
      </Typography>
      {value !== undefined ? (
        <Typography variant="small">{typeof(value) == 'object' ? (value as any).road : value}</Typography>
      ) : (
        <Skeleton
          variant="rounded"
          height={20}
          width={150}
        />
      )}
    </Box>
  )
}
