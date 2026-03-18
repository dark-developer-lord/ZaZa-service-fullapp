import { useParams } from 'react-router-dom'
import { Box, Typography, Divider, Button, TextField, } from '@mui/material'
import { LayoutContent } from '@widgets/layout'
import { useQuery } from 'react-query'
import { getQuery, getApiPaths, ApiKeys } from '@shared/api'
import { Board } from '@shared/ui'
import { useTheme } from '@mui/material'
import { RouterPaths } from '@shared/lib'

import { AcceptPaymentModal } from '@widgets/installment/accept-payment-modal'
import { useState } from 'react'

export const Page = () => {
  const [openModal, setOpenModal] = useState(false)

  const handlePayment = (amount: number) => {
    refetch()
  }

  const theme = useTheme()
  const { id } = useParams()
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [ApiKeys.Installments.getInstallmentById, id],
    queryFn: getQuery(getApiPaths().getInstallmentById_ + id),
    enabled: !!id,
  })

  if (isLoading) return <Typography>Загрузка...</Typography>
  
  if (isError || !data) return <Typography>Ошибка загрузки данных</Typography>
  
  const installment = data as any

  return (
    <Board>
      <LayoutContent
            title={"Изменить детали рассрочки №"+installment.order_id}
            breadcrumbs={[
              {
                label: 'Все рассрочки',
                path: RouterPaths.installment,
                name: 'orders',
              },
              {
                label: 'Изменить заказ',
                name: 'order-edit',
              },
            ]}
          >


      <Box>
         <Typography textAlign={'center'} fontWeight={'bold'} fontSize={'h6.fontSize'} py={2}>Корзина</Typography>
         <Divider />
        <Box display="flex" gap={2} flexWrap="wrap" my={3}>
          {installment.product?.map((item: any) => (
            <Box
              key={item.id}
              sx={{
                width: 270,
                height: 120,
                borderRadius: 2,
                borderColor: 'grey.500',
                border: 1,
                textAlign: 'left',
                p: 1,
                display: 'flex'
              }}
            >
              <Box
                component="img"
                src={item.details?.image ?? '/placeholder.png'}
                alt={item.details?.name ?? '—'}
                width="40%"
                sx={{
                  padding: 0.5,
                  borderRadius: 2
                }}
              />
              <div style={{padding: '4px'}}>
                <Typography fontSize={16} fontWeight={500} px={1}>{item.details?.name ?? '—'}</Typography>
                <Typography fontSize={16} fontWeight={'bold'} px={1}>{item.price ?? '—'} с.</Typography>
                <Typography fontSize={16} px={1}>Количество: {item.quantity ?? '—'}</Typography>
              </div>
            </Box>
          ))}
        </Box>

        {/* 🟨 Client Info Section */}
        <Typography variant="h6" textAlign={'center'}>Информация о клиенте</Typography>
        <Box mt={2} mb={2} display={'flex'} justifyContent={'space-between'}>
          <TextField fullWidth sx={{ mr: 2 }} variant='outlined' label={'Клиент'} disabled={true} value={installment.customer}></TextField>
          <TextField fullWidth sx={{ ml: 2}} variant='outlined' label={'Номер телефон'} disabled={true} value={installment.customer_phone}></TextField>
          {/* <Typography>Магазин: {installment.store}</Typography> */}
        </Box>

        <Divider />

        {/* 🟦 Installment Details */}
        <Typography variant="h6" mt={3}>Детали Рассрочки</Typography>
        <Box mt={2} mb={2} display={'flex'} justifyContent={'space-between'}>
          <TextField fullWidth sx={{ mr: 2 }} variant='outlined' label={'Сумма первоначального платежа'} disabled={true} value={installment.initial_payment + " c."}></TextField>
          <TextField fullWidth sx={{ ml: 2 }} variant='outlined' label={'Дата закрытия долга'} disabled={true} value={installment.due_date}></TextField>
        </Box>

        <Divider />

        {/* 🟪 Payment History */}
        <Typography variant="h6" mt={3}>История погашений</Typography>
        <Box mt={1} mb={2}>
          {installment.history?.length > 0 ? (
            installment.history.map((h: any, i: number) => (
              <Box key={i}>
                <Typography>{h.date} — {h.amount} сомони</Typography>
              </Box>
            ))
          ) : (
            <Typography>Нет данных</Typography>
          )}
        </Box>

        <Divider />

        {/* 🟥 Summary Section */}
        <Box mt={1} mb={2}>
          <Typography display={'flex'} justifyContent={'space-between'}><span style={{display: 'inline-block'}}>Начальная сумма долга:</span><span>{parseFloat(installment.total_due)} сомони</span></Typography>
          <Typography display={'flex'} justifyContent={'space-between'}><span style={{display: 'inline-block'}}>Погашено:</span><span>{installment.total_paid} сомони</span></Typography>
          <Typography display={'flex'} justifyContent={'space-between'}><span style={{display: 'inline-block'}}>Остаток:</span><span style={{ color: theme.palette.error.main }}>{parseFloat(installment.remaining_balance)} сомони</span></Typography>
        </Box>

        {/* Buttons */}
        <Box display="flex" gap={2} mt={3}>
          <Button variant="contained" color="primary" fullWidth onClick={() => setOpenModal(true)} disabled={installment.remaining_balance <= 0}>
            Принять оплату
          </Button>
          {/* <Button variant="outlined" color="warning" fullWidth>
            Изменить детали рассрочки
          </Button> */}
        </Box>
      </Box>
      <AcceptPaymentModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handlePayment}
        installmentId={installment.id}
        remainingBalance={parseFloat(installment.remaining_balance)}
      />
      </LayoutContent>
    </Board>
  )
}
