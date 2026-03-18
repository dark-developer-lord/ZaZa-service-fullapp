import { Grid, Divider, Typography } from '@mui/material'
import { AxiosError } from 'axios'

import { LayoutContent } from '@widgets/layout'
import { SaleInfo, Total } from '@widgets/sale-show'

import { SaleCourierInfo, useGetSale } from '@entities/sale'
import { RouterPaths } from '@shared/lib'

import { NotFound } from './not-found'
import { Board } from '@shared/ui'
import { ProductsTable } from '@entities/sale'

export const Page = () => {
  const { error, data, isFetching } = useGetSale()

  if (error && error instanceof AxiosError && error.response?.status === 404) {
    return <NotFound />
  }

  return (
    <LayoutContent
      title={`Реализация № ${data?.data.id}`}
      breadcrumbs={[
        {
          label: 'Склад',
          path: RouterPaths.warehouse,
          name: 'orders',
        },
        {
          label: 'Реализация',
          name: 'sales',
          path: RouterPaths.warehouse + "?report=sales"
        },
        {
          label: 'Подробнее',
          name: 'sale-show',
        },
      ]}
    >
      <Grid
        container
        spacing="16px"
      >
        <Grid
          item
          xs={12}
          mobile={7}
        >
          <SaleInfo />
        </Grid>
        <Grid
          item
          xs={12}
          mobile={5}
        >
          <SaleCourierInfo />
        </Grid>
        <Grid item xs={12}>
          <Board>
            <Typography
              variant="h6"
              mb="24px"
              textAlign="center"
              width="100"
            >
              Товары
            </Typography>
            <ProductsTable
              data={data?.data.products}
              isFetching={isFetching}
              error={error}
            />
            <Divider />
            <Total />
          </Board>
        </Grid>
      </Grid>
    </LayoutContent>
  )
}
