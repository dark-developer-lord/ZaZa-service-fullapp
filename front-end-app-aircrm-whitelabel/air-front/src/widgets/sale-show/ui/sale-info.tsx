import { Box, Grid, TextField, Typography } from '@mui/material'

import { useGetSale } from '@entities/sale'
import { formatPhoneNumber } from '@shared/lib'
import { Board } from '@shared/ui'

export const SaleInfo = () => {
  const { data, isFetching } = useGetSale()
  return (
    <Board>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography
            variant="h6"
            mb={3}
            textAlign="center"
            width="100%"
        >Общая информация </Typography>
      </Box>
      <Grid
        container
        spacing={3}
      >
        <Grid item xs={12} mobile={6}>
            <TextField
                fullWidth
                name="name"
                label="Имя клиента"
                value={isFetching ? "" : data?.data.name}
                disabled
            />
        </Grid>
        <Grid item xs={12} mobile={6}>
            <TextField
                fullWidth
                name="sale_name"
                label="Наименование Реализации"
                value={isFetching ? "" : (data?.data.sale_name || "-")}
                disabled
            />
        </Grid>
        <Grid item xs={12} mobile={6}>
            <TextField
                fullWidth
                name="phone"
                label="Телефон клиента"
                value={isFetching ? "" : (data?.data && formatPhoneNumber(data?.data.phone))}
                disabled
            />
        </Grid>
        <Grid item xs={12} mobile={6}>
            <TextField
                fullWidth
                name="delivery_charge"
                label="Стоимость доставки"
                value={isFetching ? "" : data?.data.delivery_charge}
                disabled
            />
        </Grid>
        <Grid item xs={12} mobile={6}>
            <TextField
                fullWidth
                name="status"
                label="Статус проведения"
                value={
                  isFetching ? "" :
                  (data?.data.status as string) === "completed" ? "Проведен" :
                  (data?.data.status as string) === "refunded" ? "Возврат" :
                  "Черновик"
                }
                disabled
            />
        </Grid>
      </Grid>
    </Board>
  )
}
