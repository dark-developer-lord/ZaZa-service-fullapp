import { Grid, Stack } from '@mui/material'
import { AxiosError } from 'axios'

import { LayoutContent } from '@widgets/layout'
import { OrderFoods, OrderInfo } from '@widgets/order-show'
import { CourierAssignButton } from '@features/order-show'
import {
  OrderAcceptedInfo,
  OrderCourierInfo,
  OrderCustomerInfo,
  OrderRestaurantInfo,
  useGetOrder,
} from '@entities/orders'
import { useProfile } from '@shared/auth'
import { RouterPaths } from '@shared/lib'

import { NotFound } from './not-found'

export const Page = () => {
  const { error } = useGetOrder()
  const loginSource = useProfile((profile) => profile.source)

  if (error && error instanceof AxiosError && error.response?.status === 404) {
    return <NotFound />
  }

  return (
    <LayoutContent
      title="Подробнее"
      breadcrumbs={[
        {
          label: 'Все заказы',
          path: RouterPaths.orders,
          name: 'orders',
        },
        {
          label: 'Подробнее',
          name: 'order-show',
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
          <Stack spacing="16px">
            <OrderInfo />
            <OrderFoods />
          </Stack>
        </Grid>
        <Grid
          item
          xs={12}
          mobile={5}
        >
          <Stack spacing="16px">
            <OrderCourierInfo ButtonSlot={CourierAssignButton} />
            <OrderCustomerInfo />
            {/* <OrderCommentInfo /> */}
            {loginSource === 'admin' && <OrderRestaurantInfo />}
            <OrderAcceptedInfo />
            {/* {loginSource === 'admin' && <OrderAcceptedInfo />} */}
          </Stack>
        </Grid>
      </Grid>
    </LayoutContent>
  )
}
