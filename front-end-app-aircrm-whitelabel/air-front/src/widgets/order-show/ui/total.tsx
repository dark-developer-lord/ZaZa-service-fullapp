import { Stack, Box, Typography, Divider } from '@mui/material'

import { useGetOrder } from '@entities/orders'
import { InfoItem } from '@shared/ui'

export const Total = () => {
  const { data } = useGetOrder()
  const order = data?.data
  const orderInstallment = order?.orderInstallment
  const wallets = order?.wallets || []
  const pointsUsed = order?.points_used ? parseFloat(order.points_used) : 0
  const pointsEarned = order?.points_earned ? parseFloat(order.points_earned) : 0

  const totalAmount = order ? order.details_total_price + order.delivery_charge - order.total_discount : 0

  return (
    <Stack
      spacing="12px"
      mt="72px"
    >
      <InfoItem
        label="Итого"
        total={data?.data.details_total_price}
      />
      <InfoItem
        label="Доставка"
        total={data?.data.delivery_charge}
      />
      <InfoItem
        label="Скидка"
        total={data?.data.total_discount}
        totalProps={{ color: 'error.main' }}
      />
      {pointsUsed > 0 && (
        <InfoItem
          label="Списано баллов"
          total={pointsUsed}
          totalProps={{ color: 'error.main' }}
        />
      )}
      <InfoItem
        label="К оплате"
        total={totalAmount}
      />

      {order?.is_installment && orderInstallment && (
        <>
          <Divider sx={{ my: '16px' }} />
          <Typography variant="subtitle2" color="text.secondary" mb="8px">
            Рассрочка
          </Typography>
          <InfoItem
            label="Первоначальный платеж"
            total={parseFloat(orderInstallment.initial_payment)}
          />
          <InfoItem
            label="Остаток долга"
            total={parseFloat(orderInstallment.remaining_balance)}
            totalProps={{ color: 'warning.main' }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="medium" color="text.secondary">
              Дата закрытия долга
            </Typography>
            <Typography variant="medium" fontWeight={600}>
              {new Date(orderInstallment.due_date).toLocaleDateString('ru-RU')}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="medium" color="text.secondary">
              Статус оплаты
            </Typography>
            <Typography
              variant="medium"
              fontWeight={600}
              color={orderInstallment.is_paid ? 'success.main' : 'warning.main'}
            >
              {orderInstallment.is_paid ? 'Оплачено' : 'Не оплачено'}
            </Typography>
          </Box>
        </>
      )}

      {wallets.length > 0 && (
        <>
          <Divider sx={{ my: '16px' }} />
          <Typography variant="subtitle2" color="text.secondary" mb="8px">
            Способы оплаты
          </Typography>
          {wallets.map((wallet) => (
            <Box key={wallet.id}>
              <InfoItem
                label={wallet.name}
                total={wallet.amount}
              />
              <Typography variant="caption" color="text.secondary" sx={{ ml: 0, display: 'block', mt: '-8px', mb: '8px' }}>
                Статус: {wallet.status === 'success' ? 'Успешно' : wallet.status === 'pending' ? 'В ожидании' : 'Отклонено'}
                {wallet.payment_type === 'initial_payment' && ' • Первоначальный платеж'}
                {wallet.paid_at && ` • ${new Date(wallet.paid_at).toLocaleString('ru-RU')}`}
              </Typography>
            </Box>
          ))}
        </>
      )}

      {(pointsUsed > 0 || pointsEarned > 0) && (
        <>
          <Divider sx={{ my: '16px' }} />
          <Typography variant="subtitle2" color="text.secondary" mb="8px">
            Баллы лояльности
          </Typography>
          {pointsUsed > 0 && (
            <InfoItem
              label="Использовано баллов"
              total={pointsUsed}
              totalProps={{ color: 'error.main' }}
            />
          )}
          {pointsEarned > 0 && (
            <InfoItem
              label="Начислено баллов"
              total={pointsEarned}
              totalProps={{ color: 'success.main' }}
            />
          )}
        </>
      )}
    </Stack>
  )
}
