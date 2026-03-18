import { useEffect } from 'react'
import { Grid, Stack } from '@mui/material'

import { LayoutContent } from '@widgets/layout'
import {
  FoodList,
  PosTerminalFilter,
  AddCourier,
  CartCard,
  CustomerInfoCard,
  CheckoutCard
} from '@widgets/pos-terminal'
import {
  CartStorage,
  FoodModal,
  useCartStore,
} from '@features/pos-terminal'

export const Page = () => {
  const setCart = useCartStore((state) => state.setCart)

  /** init cart and load foods from LS */
  useEffect(() => {
    CartStorage.init()
    CartStorage.loadNewOrderCart().then((store) => {
      setCart(store)
    })
  }, [])

  return (
    <LayoutContent
      title="Новый заказ"
      breadcrumbs={[
        {
          label: 'Новый заказ',
          name: 'new-order',
        },
      ]}
    >
      <FoodModal />
      <Grid
        container
        spacing="16px"
      >
        <Grid
          item
          xs={12}
          mobile={true}
          sx={{ flex: 1 }}
        >
          <Stack spacing="16px">
            <PosTerminalFilter />
            <FoodList />
          </Stack>
        </Grid>
        <Grid
          item
          xs={12}
          mobile="auto"
          sx={{
            width: { xs: '100%', mobile: '420px' },
            flexShrink: 0
          }}
        >
          <AddCourier />

          <CartCard />
          <CustomerInfoCard />
          <CheckoutCard />
        </Grid>
      </Grid>
    </LayoutContent>
  )
}
