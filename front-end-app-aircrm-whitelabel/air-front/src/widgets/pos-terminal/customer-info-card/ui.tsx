import { useState, useEffect } from 'react'
import { Box, Stack, useTheme, useMediaQuery } from '@mui/material'

import {
  PosTerminalSelectAddress,
  PosTerminalSelectCustomer,
  PosTerminalDelivery,
  PosTerminalComment,
  useCartStore,
} from '@features/pos-terminal'
import { CollapsibleCard } from '@shared/ui'

export const CustomerInfoCard = () => {
  const [expanded, setExpanded] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const foods = useCartStore((state) => state.foods)

  // Auto-expand when cart has items
  useEffect(() => {
    if (foods.length > 0) {
      setExpanded(true)
    }
  }, [foods.length])

  return (
    <>
      <CollapsibleCard
        title="Информация о клиенте"
        defaultExpanded={false}
        expanded={expanded}
        onToggle={setExpanded}
        sx={{ mb: 2, bgcolor: 'white' }}
      >
        <Stack spacing="24px">
          <PosTerminalSelectCustomer />

          <Box
            sx={{
              display: 'flex',
              gap: 2,
              flexDirection: isMobile ? 'column' : 'row',
              width: '100%',
              '& > *': {
                flex: 1,
                minWidth: 0,
                maxWidth: '100%'
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

          <Box>
            <PosTerminalComment />
          </Box>
        </Stack>
      </CollapsibleCard>
    </>
  )
}
