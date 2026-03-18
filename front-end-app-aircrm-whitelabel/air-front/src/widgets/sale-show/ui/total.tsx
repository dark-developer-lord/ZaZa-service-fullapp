import { Stack, Divider, Typography, Box } from '@mui/material'

import { useGetSale } from '@entities/sale'
import { InfoItem } from '@shared/ui'

export const Total = () => {
  const { data } = useGetSale()
  const installment = data?.data.installment

  return (
    <Stack
      spacing="12px"
      mt="72px"
    >
      <InfoItem
        label="Итого"
        total={data?.data.total_price}
      />
      <InfoItem
        label="Доставка"
        total={data?.data.delivery_charge}
      />
      <InfoItem
        label="Скидка"
        total={data?.data?.discount || 0}
        totalProps={{ color: 'error.main' }}
      />
      
      {installment && (
        <>
          <Divider sx={{ my: '8px' }} />
          <Typography variant="subtitle2" color="text.secondary" mb="4px">
            Рассрочка
          </Typography>
          <InfoItem
            label="Первоначальный платеж"
            total={parseFloat(installment.initial_payment)}
          />
          <InfoItem
            label="Остаток долга"
            total={parseFloat(installment.remaining_balance)}
            totalProps={{ color: 'warning.main' }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="medium" color="text.secondary">
              Дата закрытия долга
            </Typography>
            <Typography variant="medium" fontWeight={600}>
              {new Date(installment.due_date).toLocaleDateString('ru-RU')}
            </Typography>
          </Box>
        </>
      )}
      
      <InfoItem
        label="К оплате"
        total={
          data
            ? data.data.total_price + data.data.delivery_charge - (data.data.discount || 0)
            : undefined
        }
      />
    </Stack>
  )
}
