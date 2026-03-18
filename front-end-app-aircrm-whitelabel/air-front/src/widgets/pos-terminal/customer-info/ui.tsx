import { Box, Stack, Typography, Divider, useTheme, useMediaQuery } from '@mui/material'

import {
  PosTerminalSelectAddress,
  PosTerminalSelectCustomer,
  PosTerminalDelivery,
  PosTerminalComment,
} from '@features/pos-terminal'
import { InputLoyaltyPoints } from '@features/pos-terminal/ui/select-customer/input-loyalty-points'

export const Ui = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Box sx={{ mb: '24px' }}>
      <Typography variant="h6" sx={{ mb: '24px' }}>
        Информация о клиенте
      </Typography>
      <Stack spacing="24px">
        <PosTerminalSelectCustomer />

        {/* Delivery Address and Cost in same line */}
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexDirection: isMobile ? 'column' : 'row',
            width: '100%',
            '& > *': {
              flex: 1,
              minWidth: 0, // Allow shrinking
              maxWidth: '100%' // Prevent overflow
            }
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <PosTerminalSelectAddress />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <PosTerminalDelivery />
          </Box>
        </Box>

        {/* Comment Section */}
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Комментарий к заказу
          </Typography>
          <PosTerminalComment />
        </Box>

        {/* Divider before loyalty points */}
        <Divider />

        {/* Loyalty Points Section */}
        <InputLoyaltyPoints />
      </Stack>
    </Box>
  )
}
