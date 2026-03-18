import { Box, Skeleton, Stack, Typography } from '@mui/material'

import { Board } from '@shared/ui'

import { useGetOrder } from '../../api/get-order'

export const OrderCommentInfo = () => {
  const { data, isSuccess } = useGetOrder()

  if (
    (!isSuccess && data && data.data.comment === '') ||
    data?.data.comment_for_restaurant === ''
  ) {
    return null
  }

  return (
    <Board>
      <Typography
        variant="h6"
        sx={{ mb: '12px' }}
      >
        Коментарий
      </Typography>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
        }}
      >
        <Stack spacing="8px">
          <InfoItem
            label="Клиент"
            value={data?.data.comment || 'Нет комментария'}
          />
          <InfoItem
            label="Ресторан"
            value={data?.data.comment_for_restaurant || 'Нет комментария'}
          />
        </Stack>
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
        alignItems: 'flex-start',
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
