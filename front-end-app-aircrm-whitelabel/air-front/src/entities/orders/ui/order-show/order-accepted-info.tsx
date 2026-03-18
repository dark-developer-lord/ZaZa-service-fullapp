import {
  Avatar,
  Box,
  Chip,
  ChipOwnProps,
  Divider,
  Skeleton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'

import { useGetAccepted } from '@entities/orders/api/get-accepted'
import { formatPhoneNumber, OrderStatus, orderStatusLabels } from '@shared/lib'
import { Board } from '@shared/ui'

export const OrderAcceptedInfo = () => {
  const { data, isFetching, isLoading } = useGetAccepted()
  const admin = data?.data

  return (
    <Board>
      <Typography
        variant="h6"
        sx={{ mb: '16px' }}
      >
        История заказа
      </Typography>
      {admin && admin.length <= 0 && (
        <Typography
          variant="body2"
          sx={{ mb: '12px' }}
        >
          Пусто
        </Typography>
      )}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gridGap: '30px',
        }}
      >
        {isFetching || isLoading
          ? new Array(3).fill(null).map((_, index) => (
              <Box
                key={index}
                sx={{ display: 'flex', alignItems: 'flex-start' }}
              >
                <Skeleton
                  variant="circular"
                  sx={{ width: 80, height: 80, flexShrink: 0, mr: '24px' }}
                />
                <Stack spacing="8px">
                  <InfoItem label="ФИО" />
                  <InfoItem label="Телефон" />
                  <InfoItem label="Дата" />
                  <InfoItem label="Статус" />
                </Stack>
              </Box>
            ))
          : data?.data.map((item) => {
              let loginSource: ('admin' | 'vendor') = item.admin === null ? 'vendor' : 'admin'
              return (
                <Box key={item.id}>
                  <Divider />
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      paddingTop: '24px',
                    }}
                  >
                    {item[loginSource]?.f_name && item[loginSource]?.phone ? (
                      <Avatar
                        src={item[loginSource].image || item[loginSource].f_name || ''}
                        alt={item[loginSource].f_name || item[loginSource].l_name || ''}
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
                          admin &&
                          `${item[loginSource]?.f_name || ''} ${item[loginSource]?.l_name || ''}`
                        }
                      />
                      <InfoItem
                        label="Телефон"
                        value={
                          admin &&
                          formatPhoneNumber(item[loginSource]?.phone)
                        }
                      />
                      <InfoItem
                        label="Дата"
                        value={
                          admin &&
                          new Date(item.created_at).toLocaleString()
                        }
                      />
                      <InfoItemStatus
                        label="Статус"
                        status={item.order_status}
                      />
                    </Stack>
                  </Box>
                </Box>

            )})}
      </Box>
    </Board>
  )
}

interface InfoItemProps {
  label: string
  value?: string
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
        <Typography variant="small">{value}</Typography>
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

interface InfoItemStatusProps {
  label: string
  status: OrderStatus | 'create'
}

const InfoItemStatus = ({ label, status }: InfoItemStatusProps) => {
  const orderStatus =
    status === 'create'
      ? ({
          label: 'Создан',
          color: 'default',
        } as {
          label: string
          color: ChipOwnProps['color']
        })
      : orderStatusLabels[status]

      const theme = useTheme()
      const isMobile = useMediaQuery(theme.breakpoints.down('mobile'))

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
      {orderStatus !== undefined ? (
        <Chip
          size={!isMobile ? 'medium' : 'small'}
          label={orderStatus.label}
          color={orderStatus.color}
        />
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
