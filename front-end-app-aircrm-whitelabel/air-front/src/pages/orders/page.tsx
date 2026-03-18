import { Box, Chip, Skeleton, useMediaQuery, useTheme } from '@mui/material'

import { LayoutContent } from '@widgets/layout'
import { Orders, useGetStatus } from '@widgets/orders'
import { AddOrderButton } from '@features/orders'
// import { useGetLoginSource } from '@shared/auth'
import { orderStatusLabels, useOrdersCounts } from '@shared/lib'
import { MenuNav } from '@shared/layout/navigation/menu-nav'
import { useNavList } from '@shared/layout/navigation/use-nav-list'
import { navList } from '@app/config/nav-list'

export const Page = () => {
  // const loginSource = useGetLoginSource()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('mobile'))
  const isTablet = useMediaQuery(theme.breakpoints.down('pad'))

  const navMenu = useNavList(navList)
  return (
    <Box>
      <LayoutContent
        title={isMobile || isTablet ? <Title /> : <MenuNav item={navMenu[1].children[0]} />}
        // rightSlot={loginSource === 'admin' && <AddOrderButton />}
        breadcrumbs={[
          {
            label: 'Заказы',
            name: 'orders',
          },
        ]}
        breadcrumbsRightSlot={<AddOrderButton />}
      >

        <Orders />
      </LayoutContent>
    </Box>
  )
}

const Title = () => {
  const { data } = useOrdersCounts()
  const status = useGetStatus()

  if (!status) {
    return (
      <Box
        component="span"
        sx={{ display: 'flex', alignItems: 'center' }}
      >
        Все заказы
        {!data ? (
          <Skeleton
            width={100}
            height={32}
            variant="rounded"
            sx={{ ml: 2 }}
          />
        ) : (
          <Chip
            label={data.all}
            color="success"
            sx={{ ml: 2 }}
          />
        )}
      </Box>
    )
  }
  return (
    <Box
      component="span"
      sx={{ display: 'flex', alignItems: 'center' }}
    >
      {orderStatusLabels[status].label}
      {!data ? (
        <Skeleton
          width={100}
          height={32}
          variant="rounded"
          sx={{ ml: 2 }}
        />
      ) : (
        <Chip
          label={data[status]}
          color={orderStatusLabels[status].color}
          sx={{ ml: 2 }}
        />
      )}
    </Box>
  )
}
