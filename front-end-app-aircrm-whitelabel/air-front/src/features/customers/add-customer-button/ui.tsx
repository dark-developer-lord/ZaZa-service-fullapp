import { useState } from 'react'
import { Button, useMediaQuery, useTheme } from '@mui/material'

import { PosTerminalAddCustomer } from '@features/pos-terminal'
import AddIcon from '@icons/add-fill.svg?react'

export const AddCustomerButton = () => {
  const [openedAddClient, setOpenedAddClient] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('mobile'))

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        size={!isMobile ? 'medium' : 'small'}
        startIcon={
          <AddIcon
            width={20}
            height={20}
            fill="white"
          />
        }
        onClick={() => setOpenedAddClient(true)}
        sx={{
          '&:hover': {
            backgroundColor: '#004547',
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 8px rgba(0, 84, 86, 0.3)',
          },
          transition: 'all 0.2s ease-in-out',
        }}
      >
        Новый клиент
      </Button>
      
      <PosTerminalAddCustomer
        opened={openedAddClient}
        onClose={() => setOpenedAddClient(false)}
      />
    </>
  )
}
