import { Box, Grid } from '@mui/material'

import { LastOrders } from '@widgets/last-orders'
import { LayoutContent } from '@widgets/layout'
import { StatisticChart } from '@widgets/statistic-chart'
import { Statistics } from '@widgets/statistics'
import { TopCouriers } from '@widgets/top-couriers'
import { TopFoods } from '@widgets/top-foods'
import { TopOperators } from '@widgets/top-operator'
import { TopRestaurants } from '@widgets/top-restaurants'
import { AddOrderButton } from '@features/orders'
import { useProfile } from '@shared/auth'

export const Page = () => {
  const loginSource = useProfile((s) => s.source)
  const profile = useProfile((s) => s.profile)

  const displayName = (() => {
    if (!profile) return ''
    if ('name' in profile && profile.name) return profile.name
    const f = ('f_name' in profile && profile.f_name) ? profile.f_name : ''
    const l = ('l_name' in profile && profile.l_name) ? profile.l_name : ''
    return [f, l].filter(Boolean).join(' ') || ''
  })()
  return (
    <Box>
      <LayoutContent
        title={displayName ? `Добро пожаловать, ${displayName}!` : 'Добро пожаловать!'}
        subtitle="Здравствуйте, здесь вы можете управлять своими заказами по зонами"
        rightSlot={<AddOrderButton />}
      >
        <Grid
          container
          columnSpacing={2}
          rowSpacing={2}
        >
          <Grid
            item
            xs={12}
          >
            <Statistics />
          </Grid>
          <Grid
            item
            xs={8}
          >
            <StatisticChart />
          </Grid>
          <Grid
            item
            xs={4}
          >
            <LastOrders />
          </Grid>
          {loginSource === 'admin' && (
            <>
              {/* <Grid
                item
                xs={4}
              >
                <TopRestaurants />
              </Grid> */}
              <Grid
                item
                xs={4}
              >
                <TopFoods />
              </Grid>
              <Grid
                item
                xs={4}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gridGap: '16px',
                }}
              >
                {/* <TopCouriers />
                <TopOperators /> */}
              </Grid>
            </>
          )}
        </Grid>
      </LayoutContent>
    </Box>
  )
}
